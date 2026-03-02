// 타로 질문 API 진입점 — Redis 캐시·Bull 큐·MongoDB 트랜잭션·캐시 갱신
// タロット質問APIエントリ — Redisキャッシュ・Bullキュー・MongoDBトランザクション・キャッシュ更新
// Tarot question API entry — Redis cache, Bull queue, MongoDB transaction, cache refresh

const tarotCardInterpreterWithAIAPI = require("../../../../AI/tarotCardInterpreterWithAIAPI.js");
const cacheClient = require("../../../../cache/cacheClient.js");
const AppError = require("../../../../common/errors/AppError.js");
const commonErrors = require("../../../../common/errors/commonErrors.js");
const { userService } = require("../../../user/services/index.js");
const { chargeService } = require("../../../charge/services/index.js");
const checkVouchers = require("./checkVouchers.js");
const createTarotAndSendResponse = require("./createTarotAndSendResponse.js");
const processInterpretation = require("./processInterpretation.js");
const processVoucherConsumption = require("./processVoucherConsumption.js");
const postAdditionalQuestionToAI = require("./postAdditionalQuestionToAI.js");
const { normalizeTarotPayload } = require("./normalizeTarotPayload.js");
const mongoose = require("mongoose");
const { haikuQueue, sonnetQueue } = require("../../../../queue/tarotQueue.js");
const { getReadingType } = require("../../../../config/readingTypeConfig.js");

// 이용권·광고제거·인앱 위반 검증. 실패 시 res 응답 후 null 반환
// 利用券・広告除去・インアプ違反検証。失敗時はresで応答しnullを返す
// Validate voucher, ads-free pass, in-app violation. On failure send res and return null
async function validateTarotRequest(userId, userInfo, inputQuestionData, modelNumber, res) {
  const cardCount = inputQuestionData?.readingConfig?.cardCount;

  if (
    (modelNumber === 2 && inputQuestionData?.isVoucherModeOn) ||
    modelNumber === 3 ||
    modelNumber === 4
  ) {
    if (!checkVouchers(modelNumber, cardCount, userInfo, inputQuestionData)) {
      res.status(500).json({ success: false, message: "Not enough vouchers" });
      return null;
    }
  }

  if (
    modelNumber === 2 &&
    !inputQuestionData?.isVoucherModeOn &&
    userInfo?.adsFreePass?.name &&
    userInfo?.adsFreePass?.orderId &&
    userInfo?.adsFreePass?.expired &&
    userInfo?.adsFreePass?.name !== "" &&
    userInfo?.adsFreePass?.orderId !== "" &&
    userInfo?.adsFreePass?.expired !== ""
  ) {
    const chargeInfo = await chargeService.getChargeByOrderId(
      userInfo?.adsFreePass?.orderId,
    );
    if (!chargeInfo || !chargeInfo?.orderId) {
      await userService.updateUser({
        ...userInfo,
        adsFreePass: { name: "", orderId: "", expired: "" },
      });
      res.status(500).json({ success: false, message: "Invalid Ads Free Pass" });
      return null;
    }
    if (new Date(userInfo?.adsFreePass?.expired) < new Date()) {
      res.status(500).json({ success: false, message: "Ads Free Pass expired" });
      return null;
    }
  }

  const { checkViolationInGoogleInAppRefund } = require("../../../../common/helpers/checkViolation.js");
  const isViolated = checkViolationInGoogleInAppRefund(res, userInfo);
  if (isViolated) return null;

  return { userInfo };
}

// 동기 경로: AI 해석 → MongoDB 트랜잭션(타로 생성·유저 업데이트) → Redis 캐시 갱신
// 同期経路: AI解釈 → MongoDBトランザクション(タロット作成・ユーザー更新) → Redisキャッシュ更新
// Sync path: AI interpretation → MongoDB transaction (tarot create, user update) → Redis cache refresh
async function runSyncTarotFlow(userId, inputQuestionData, modelNumber, userInfo, res) {
  let interpretation;
  if (modelNumber === 2 || modelNumber === 3 || modelNumber === 4) {
    interpretation = await tarotCardInterpreterWithAIAPI(
      { ...inputQuestionData },
      modelNumber,
    );
  }

  const interpretationWithoutQuestion = processInterpretation(
    interpretation,
    inputQuestionData,
  );

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("final answer : \n", interpretationWithoutQuestion);
  }

  const type = getReadingType(modelNumber);

  const session = await mongoose.startSession();
  try {
    let updatedUserInfo;
    await session.withTransaction(async () => {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("=== Transaction started (Sync) ===");
      }

      if (
        inputQuestionData.tarotSpreadVoucherPrice !== undefined &&
        inputQuestionData.tarotSpreadVoucherPrice !== null
      ) {
        await createTarotAndSendResponse(
          inputQuestionData,
          interpretationWithoutQuestion,
          type,
          userInfo,
          res,
          session,
        );
        updatedUserInfo = await processVoucherConsumption(
          userInfo,
          inputQuestionData,
          session,
          modelNumber,
        );
      } else {
        await createTarotAndSendResponse(
          inputQuestionData,
          interpretationWithoutQuestion,
          type,
          userInfo,
          res,
          session,
        );

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
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log(`무료 타로 통계 증가: free=${updatedTarotUsageStats.free}`);
          }
        }

        updatedUserInfo = await userService.updateUser(
          {
            ...userInfo,
            tarotUsageStats: { ...updatedTarotUsageStats },
          },
          session,
        );
      }

      await cacheClient.del(`user:${userId}`);
      await cacheClient.del(`cache:tarot:${userId}`);
      await cacheClient.set(`user:${userId}`, updatedUserInfo, 3600);
    });
  } catch (error) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error("=== Transaction failed (Sync) ===", error);
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

async function postQuestionToAI(req, res, next, modelNumber) {
  try {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;

    if (req?.isAuthenticated() !== true) {
      next(
        new AppError(
          commonErrors.tarotControllerPostQuestionError,
          commonErrors.userNotFoundError,
          404,
        ),
      );
      return;
    }

    // 공개 소스에서는 payload가 추상화되어 전달되므로, 서버에서 실제 처리 형태로 먼저 정규화한다.
    // 公開ソースでは payload が抽象化されて渡されるため、サーバーで先に実処理形へ正規化する。
    // In the public-source flow, payloads arrive abstracted, so the server normalizes them before processing.
    const inputQuestionData = normalizeTarotPayload(req?.body);
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("NODE_ENV=", JSON.stringify(process.env.NODE_ENV));
    }

    if (inputQuestionData?.isAdditionalQuestion === true) {
      return await postAdditionalQuestionToAI(req, res, next, modelNumber);
    }

    // Redis 캐시에서 유저 조회 (캐시 미스 시 DB)
    // Redisキャッシュからユーザー取得（キャッシュミス時はDB）
    // Get user from Redis cache (DB on cache miss)
    const userFromCache = await cacheClient.get(`user:${userId}`);
    const userInfo = userFromCache
      ? userFromCache
      : await userService.getUserById(userId);

    const validated = await validateTarotRequest(
      userId,
      userInfo,
      inputQuestionData,
      modelNumber,
      res,
    );
    if (validated === null) return;

    // useQueue 시 Redis/Bull 큐에 job 등록 → 202 Accepted
    // useQueueのときRedis/Bullキューにjob登録 → 202 Accepted
    // When useQueue, enqueue job to Redis/Bull → 202 Accepted
    if (inputQuestionData?.useQueue === true) {
      const crypto = require("crypto");
      const jobId = crypto.randomUUID();
      const queue = modelNumber === 2 ? haikuQueue : sonnetQueue;
      const job = await queue.add(
        { userId, inputQuestionData, modelNumber },
        { jobId },
      );
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`[Controller] Job Enqueued: ${job.id}`);
      }
      return res.status(202).json({
        success: true,
        message: "Job queued",
        status: "queued",
        jobId: job.id,
      });
    }

    // 동기 경로: AI 해석 + MongoDB 트랜잭션 + Redis 캐시 갱신
    // 同期経路: AI解釈 + MongoDBトランザクション + Redisキャッシュ更新
    // Sync path: AI interpretation + MongoDB transaction + Redis cache refresh
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("[Controller] Processing Synchronously for Legacy App");
    }
    await runSyncTarotFlow(
      userId,
      inputQuestionData,
      modelNumber,
      validated.userInfo,
      res,
    );
  } catch (err) {
    next(new AppError(err.name, err.message, err.statusCode));
  }
}

module.exports = postQuestionToAI;
