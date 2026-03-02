const Queue = require("bull");
const queueRedisConfig = require("../config/queueConfig");
const { getReadingType } = require("../config/readingTypeConfig");
const tarotCardInterpreterWithAIAPI = require("../AI/tarotCardInterpreterWithAIAPI");
const cacheClient = require("../cache/cacheClient");
const { userService } = require("../domains/user/services/index");
const createTarotAndSendResponse = require("../domains/tarot/controllers/utils/createTarotAndSendResponse");
const processInterpretation = require("../domains/tarot/controllers/utils/processInterpretation");
const processVoucherConsumption = require("../domains/tarot/controllers/utils/processVoucherConsumption");
const mongoose = require("mongoose");
const { commonErrors, wrapError, createError } = require("../common/errors");

// 공통 옵션
// 共通オプション
// Common options
const jobOptions = {
  redis: queueRedisConfig.redis,
  settings: {
    lockDuration: 60000, // 1분 (기본 30초) - 작업이 길어질 수 있으므로 늘림
    stalledInterval: 60000, // 1분 (기본 30초) - 이벤트 루프 지연 대비
    maxStalledCount: 3, // 3번까지 stalled 허용 (일시적 멈춤 방어)
  },
  defaultJobOptions: {
    removeOnComplete: { age: 240 }, // 완료 후 4분 동안 보관 (Polling 완료 시점까지)
    removeOnFail: true, // 실패한 작업 즉시 삭제 (기록 남기지 않음)
    attempts: 2, // 실패시 2번까지 재시도 (일시적 429 에러 방어)
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    timeout: 240000, // 4분 타임아웃
  },
};

// 1. 큐 생성 (모델별 분리: Haiku, Sonnet)
// 1. キュー作成（モデル別分離: Haiku, Sonnet）
// 1. Create queues (per model: Haiku, Sonnet)
const haikuQueue = new Queue("haiku-queue", jobOptions);
const sonnetQueue = new Queue("sonnet-queue", jobOptions);

// 워커(프로세서) 등록은 import 부작용으로 자동 실행하지 말고,
// 명시적으로 init 함수를 호출했을 때만 실행되게 한다.
// ワーカー(プロセッサ)登録はimportの副作用で自動実行せず、明示的にinitを呼んだときだけ実行する。
// Do not run worker (processor) registration as an import side effect; run only when init is explicitly called.
let processorsInitialized = false;

// 2. 공통 워커 로직
// 2. 共通ワーカー処理
// 2. Common worker logic
const processJob = async (job) => {
  const { userId, inputQuestionData, modelNumber } = job.data;

  try {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(
        `[Queue] Processing job ${job.id} for user ${userId} (Model: ${modelNumber})`,
      );
    }

    // 사용자 최신 정보 조회 (데이터 정합성)
    // ユーザーの最新情報を照会 (データの整合性)
    // Get latest user info (data consistency)
    const userInfo = await userService.getUserById(userId);
    if (!userInfo) {
      throw createError(commonErrors.userNotFoundError, { statusCode: 404 });
    }

    // AI 해석 요청
    // AI解釈リクエスト
    // AI interpretation request
    let interpretation;
    if (modelNumber === 2 || modelNumber === 3 || modelNumber === 4) {
      interpretation = await tarotCardInterpreterWithAIAPI(
        { ...inputQuestionData },
        modelNumber,
      );
    }

    if (!interpretation) {
      throw createError(commonErrors.fatalError, { statusCode: 500 });
    }

    updateJobProgress(job, 50); // 진행률 업데이트 / 進捗更新 / Update progress

    const interpretationWithoutQuestion = processInterpretation(
      interpretation,
      inputQuestionData,
    );

    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(
        "final answer(queue worker) : \n",
        interpretationWithoutQuestion,
      );
    }

    const type = getReadingType(modelNumber);

    // MongoDB 트랜잭션: 기본 connection에서만 세션 생성 (다중 인스턴스/풀에서 "ClientSession must be from the same MongoClient" 방지)
    // MongoDBトランザクション: 基本connectionでのみセッション生成（複数インスタンス/プールで「ClientSession must be from the same MongoClient」防止）
    // MongoDB transaction: create session only on default connection (avoid "ClientSession must be from the same MongoClient" in multi-instance/pool)
    const conn = mongoose.connection;
    if (conn.readyState !== 1) {
      throw createError(commonErrors.databaseError, { statusCode: 500 });
    }
    const session = await conn.startSession();
    let finalResult;

    try {
      await session.withTransaction(async () => {
        // 1. 타로 생성
        // 1. タロット作成
        // 1. Create tarot
        let updatedUserInfo;
        if (
          inputQuestionData.tarotSpreadVoucherPrice !== undefined &&
          inputQuestionData.tarotSpreadVoucherPrice !== null
        ) {
          // 바우처 모드
          // バ우처モード
          // Voucher mode
          finalResult = await createTarotAndSendResponse(
            inputQuestionData,
            interpretationWithoutQuestion,
            type,
            userInfo,
            null, // res 없음 (백그라운드 처리)
            session,
          );

          // 2. 바우처 차감
          // 2. バウチャー控除
          // 2. Deduct voucher
          updatedUserInfo = await processVoucherConsumption(
            userInfo,
            inputQuestionData,
            session,
            modelNumber,
          );
        } else {
          // 애드몹 광고 모드
          // アドモブ広告モード
          // AdMob ad mode
          finalResult = await createTarotAndSendResponse(
            inputQuestionData,
            interpretationWithoutQuestion,
            type,
            userInfo,
            null, // res 없음 (백그라운드 처리)
            session,
          );

          // 2. 사용자 정보 업데이트 (무료 타로 통계 증가)
          // 2. ユーザー情報更新（無料タロット統計増加）
          // 2. Update user info (increment free tarot stats)
          let updatedTarotUsageStats = {
            free: 0,
            normal: 0,
            deep: 0,
            serious: 0,
            ...(userInfo?.tarotUsageStats || {}),
          };

          const hasActiveAdsFreePass =
            userInfo?.adsFreePass?.name &&
            userInfo?.adsFreePass?.orderId &&
            userInfo?.adsFreePass?.expired &&
            new Date(userInfo?.adsFreePass?.expired) > new Date();

          if (!hasActiveAdsFreePass) {
            updatedTarotUsageStats.free += 1;
          }

          updatedUserInfo = await userService.updateUser(
            {
              ...userInfo,
              tarotUsageStats: { ...updatedTarotUsageStats },
            },
            session,
          );
        }
      });

      // 3. 캐시 업데이트 (트랜잭션 성공 후)
      // 3. キャッシュ更新（トランザクション成功後）
      // 3. Cache update (after transaction success)
      await cacheClient.del(`user:${userId}`);
      await cacheClient.del(`cache:tarot:${userId}`);

      updateJobProgress(job, 100);
      return finalResult; // Job 완료 결과로 반환
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("=== Transaction failed (Worker) ===", error);
      }
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (err) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error(`[Queue] Job ${job.id} failed:`, err);
    }
    throw err; // Bull이 재시도하거나 실패 처리하도록 에러 전파
  }
};

// 4. 이벤트 리스너
function attachListeners(queue, name) {
  queue.on("completed", (job, result) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(`[${name}] Job ${job.id} completed!`);
    }
  });

  queue.on("failed", (job, err) => {
    console.error(`[${name}] Job ${job.id} failed: ${err.message}`);
  });
}

function initTarotQueueProcessors(
  options = { haikuConcurrency: 50, sonnetConcurrency: 50 },
) {
  if (processorsInitialized) return;
  processorsInitialized = true;

  const { haikuConcurrency = 50, sonnetConcurrency = 50 } = options || {};

  // 3. 프로세서 연결
  // 3. プロセッサ接続
  // 3. Attach processors
  haikuQueue.process(haikuConcurrency, processJob);
  sonnetQueue.process(sonnetConcurrency, processJob);

  // 4. 이벤트 리스너
  // 4. イベントリスナー
  // 4. Event listeners
  attachListeners(haikuQueue, "HaikuQueue");
  attachListeners(sonnetQueue, "SonnetQueue");

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(
      `[Queue] Processors initialized (pid=${process.pid}): HaikuQueue (${haikuConcurrency}), SonnetQueue (${sonnetConcurrency})`,
    );
  }
}

function updateJobProgress(job, progress) {
  try {
    job.progress(progress);
  } catch (e) {
    // ignore
  }
}

// 두 개의 큐를 내보냄
// 2つのキューをエクスポート
// Export two queues
module.exports = { haikuQueue, sonnetQueue, initTarotQueueProcessors };
