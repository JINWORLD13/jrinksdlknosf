const tarotCardInterpreterWithAIAPI = require("../../../../AI/tarotCardInterpreterWithAIAPI.js");
const cacheClient = require("../../../../cache/cacheClient.js");
const AppError = require("../../../../common/errors/AppError.js");
const commonErrors = require("../../../../common/errors/commonErrors.js");
const {
  checkViolationInGoogleInAppRefund,
} = require("../../../../common/helpers/checkViolation.js");
const { userService } = require("../../../user/services/index.js");
const { chargeService } = require("../../../charge/services/index.js");
const { tarotService } = require("../../services/index.js");
const checkVouchers = require("../utils/checkVouchers.js");
const createTarotAndSendResponse = require("../utils/createTarotAndSendResponse.js");
const processInterpretation = require("../utils/processInterpretation.js");
const processVoucherConsumption = require("../utils/processVoucherConsumption.js");
const { normalizeTarotPayload } = require("./normalizeTarotPayload.js");
const mongoose = require("mongoose");
const { getReadingType } = require("../../../../config/readingTypeConfig.js");

function extractCardName(cardStr) {
  if (typeof cardStr !== "string") return null;
  return cardStr.split("(")[0]?.trim() || null;
}

function dedupeCardsByNamePreserveOrder(cardsArr) {
  const seen = new Set();
  const result = [];
  for (const cardStr of Array.isArray(cardsArr) ? cardsArr : []) {
    if (typeof cardStr !== "string") continue;
    const name = extractCardName(cardStr);
    if (!name) continue;
    if (seen.has(name)) continue;
    seen.add(name);
    result.push(cardStr);
  }
  return result;
}

async function safeGetTarotById(tarotService, id) {
  if (!id) return null;
  try {
    return await tarotService.getTarotById(id);
  } catch (e) {
    return null;
  }
}

async function buildPathTarots({
  tarotService,
  originalTarotId,
  parentTarotId,
}) {
  // parentTarotId부터 originalTarotId까지 parentTarotId를 따라가며 경로를 구성
  // 반환: { pathTarotsInOrder, parentTarot, originalTarot }
  // parentTarotIdからoriginalTarotIdまでparentTarotIdを辿って経路を構成。返却: { pathTarotsInOrder, parentTarot, originalTarot }
  // Build path from parentTarotId to originalTarotId by following parentTarotId. Returns: { pathTarotsInOrder, parentTarot, originalTarot }
  const originalTarot = await safeGetTarotById(tarotService, originalTarotId);
  if (!originalTarot) {
    return { pathTarotsInOrder: [], parentTarot: null, originalTarot: null };
  }

  // parentTarotId가 없으면 원본이 parent
  // parentTarotIdがなければ原典がparent
  // If no parentTarotId, original is parent
  let cursor =
    (await safeGetTarotById(tarotService, parentTarotId)) || originalTarot;

  // 다른 원본에 속한 타로면 원본으로 강제
  if (
    cursor?.originalTarotId &&
    cursor.originalTarotId?.toString?.() !== originalTarotId?.toString?.()
  ) {
    cursor = originalTarot;
  }

  const visited = new Set();
  const reversed = [];
  let depth = 0;

  while (cursor && depth < 10) {
    const idStr = cursor?._id?.toString?.();
    if (!idStr || visited.has(idStr)) break;
    visited.add(idStr);
    reversed.push(cursor);

    // 원본에 도달하면 종료
    // 原典に到達したら終了
    // Exit when reaching original
    if (cursor?._id?.toString?.() === originalTarot?._id?.toString?.()) break;

    // 다음 parent로 이동
    // 次のparentへ移動
    // Move to next parent
    if (!cursor?.parentTarotId) {
      // legacy 데이터: parentTarotId가 없으면 원본으로 스냅
      // レガシーデータ: parentTarotIdがなければ原典にスナップ
      // Legacy: if no parentTarotId, snap to original
      cursor = originalTarot;
    } else {
      cursor = await safeGetTarotById(tarotService, cursor.parentTarotId);
      if (
        cursor?.originalTarotId &&
        cursor.originalTarotId?.toString?.() !== originalTarotId?.toString?.()
      ) {
        cursor = originalTarot;
      }
    }

    depth += 1;
  }

  const pathTarotsInOrder = reversed.reverse(); // original -> ... -> parent
  const parentTarot = pathTarotsInOrder[pathTarotsInOrder.length - 1] || null;
  return { pathTarotsInOrder, parentTarot, originalTarot };
}

async function postAdditionalQuestionToAI(req, res, next, modelNumber) {
  try {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;
    if (req?.isAuthenticated() === true) {
      // 추가질문 경로도 동일하게 추상 payload를 복원해 기존 비즈니스 로직과 호환시킨다.
      // 追加質問経路でも同様に抽象 payload を復元し、既存ビジネスロジックと互換させる。
      // The additional-question path also restores abstract payloads to stay compatible with existing business logic.
      const inputQuestionData = normalizeTarotPayload(req?.body);
      const userFromCache = await cacheClient.get(`user:${userId}`);
      const userInfo = userFromCache
        ? userFromCache
        : await userService.getUserById(userId);
      const cardCount = inputQuestionData?.readingConfig?.cardCount;
      const userVouchers = userInfo?.vouchers;

      //! 이용권 보유수 검증
      if (
        (modelNumber === 2 && inputQuestionData?.isVoucherModeOn) ||
        modelNumber === 3 ||
        modelNumber === 4
      ) {
        if (
          !checkVouchers(
            modelNumber,
            cardCount,
            userInfo, // userVouchers -> userInfo로 변경
            inputQuestionData,
          )
        ) {
          return res.status(500).json({ success: false });
        }
      }

      //! 인앱결제 위반 유저는 제재함
      //! インアプ決済違反ユーザーは制裁
      //! Sanction in-app payment violation users
      const isViolated = checkViolationInGoogleInAppRefund(res, userInfo);
      if (isViolated) {
        return;
      }

      // DB에서 질문 체인 가져오기 (originalTarotId가 있는 경우)
      // DBから質問チェーン取得（originalTarotIdがある場合）
      // Fetch question chain from DB (when originalTarotId exists)
      let questionChainFromDB = [];
      const inputOriginalTarotId = inputQuestionData?.originalTarotId || null;
      const inputParentTarotId =
        inputQuestionData?.parentTarotId ||
        inputQuestionData?.previousTarotId ||
        (Array.isArray(inputQuestionData?.questionChain) &&
        inputQuestionData.questionChain.length > 0
          ? inputQuestionData.questionChain[
              inputQuestionData.questionChain.length - 1
            ]?._id
          : null) ||
        null;

      // originalTarotId 정규화:
      // - 클라이언트가 "직전 추가타로 _id"를 originalTarotId로 보내더라도,
      //   서버에서 최초(원본) 타로 _id로 교정한다.
      let originalTarotId = inputOriginalTarotId;

      if (originalTarotId) {
        try {
          // 우선 전달된 id로 타로를 조회 (원본일 수도/추가타로일 수도 있음)
          // まず渡されたidでタロットを照会（原典または追加タロットの可能性）
          // Look up tarot by given id (may be original or additional tarot)
          const maybeOriginalOrAdditional =
            await tarotService.getTarotById(originalTarotId);

          // 전달된 id가 "추가타로"라면, 그 추가타로가 참조하는 originalTarotId를 사용
          // 渡されたidが「追加タロット」なら、その追加タロットが参照するoriginalTarotIdを使用
          // If given id is "additional tarot", use the originalTarotId it references
          if (maybeOriginalOrAdditional?.originalTarotId) {
            originalTarotId = maybeOriginalOrAdditional.originalTarotId;
          }
        } catch (error) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.error("Failed to fetch tarot chain from DB:", error);
          }
        }
      }

      // 분기 지원: parentTarotId 기반 경로(원본 -> ... -> parent)로 체인/누적카드 구성
      const { pathTarotsInOrder, parentTarot, originalTarot } =
        await buildPathTarots({
          tarotService,
          originalTarotId,
          parentTarotId: inputParentTarotId,
        });

      // 경로 기반 questionChainFromDB 생성 (siblings 포함 방지)
      // 経路ベースでquestionChainFromDB生成（siblings含め防止）
      // Build questionChainFromDB from path (avoid including siblings)
      if (pathTarotsInOrder.length > 0) {
        questionChainFromDB = pathTarotsInOrder.map((t) => ({
          questionData: t.questionData,
          interpretation: t.interpretation,
          readingConfig: t.readingConfig,
          _id: t._id,
          additionalQuestionCount: t.additionalQuestionCount,
        }));
      }

      // 클라이언트에서 전달된 questionChain과 DB에서 가져온 체인 결합
      // DB에서 가져온 체인이 더 정확하고 완전하므로 우선 사용
      const clientQuestionChain = inputQuestionData.questionChain || [];

      // DB에서 가져온 _id 목록 (중복 제거용)
      // DBから取得した_id一覧（重複除去用）
      // List of _ids from DB (for deduplication)
      const dbIds = new Set(
        questionChainFromDB.map((item) => item._id?.toString()).filter(Boolean),
      );

      // 클라이언트 체인에서 DB에 없는 항목만 추가 (중복 방지)
      const uniqueClientChain = clientQuestionChain.filter((item) => {
        const itemId = item._id?.toString();
        return itemId && !dbIds.has(itemId);
      });

      // 최종 체인: DB 체인 + 클라이언트에서 추가된 항목
      // 最終チェーン: DBチェーン＋クライアントで追加された項目
      // Final chain: DB chain + items added from client
      const combinedQuestionChain = [
        ...questionChainFromDB,
        ...uniqueClientChain,
      ];

      // 이전 질문/답변 컨텍스트와 추가 질문/카드 결합
      // 제너럴 리딩 맞춤 해석: questionChain[0].readingConfig 폴백
      const firstChainItem = combinedQuestionChain?.[0];
      const resolvedPreviousSpreadInfo =
        inputQuestionData.previousSpreadInfo ||
        (inputQuestionData?.isCustomInterpretationFromGeneralReading && firstChainItem?.readingConfig
          ? firstChainItem.readingConfig
          : null);

      const previousContext = {
        previousQuestionInfo: inputQuestionData.previousQuestionInfo,
        previousSpreadInfo: resolvedPreviousSpreadInfo,
        previousAnswer: inputQuestionData.previousAnswer,
        questionChain: combinedQuestionChain, // DB에서 가져온 체인 포함
      };

      // combinedReadingConfig 생성 규칙(분기 지원): parentTarot까지의 "경로"에 포함된 카드만 누적
      const baseCardsArr =
        parentTarot?.combinedReadingConfig?.selectedTarotCardsArr?.length > 0
          ? parentTarot.combinedReadingConfig.selectedTarotCardsArr
          : parentTarot?.readingConfig?.selectedTarotCardsArr ||
            originalTarot?.readingConfig?.selectedTarotCardsArr ||
            [];
      const newCardsArr =
        inputQuestionData?.readingConfig?.selectedTarotCardsArr || [];
      const combinedSelectedTarotCardsArr = dedupeCardsByNamePreserveOrder([
        ...baseCardsArr,
        ...newCardsArr,
      ]);

      // AI 해석용 combinedReadingConfig: spread 메타 유지, 카드 배열만 누적
      const combinedReadingConfigForAI = {
        ...inputQuestionData.readingConfig,
        cardCount: combinedSelectedTarotCardsArr.length, // 누적 카드 개수
        selectedTarotCardsArr: combinedSelectedTarotCardsArr,
      };

      // DB 저장용 combinedReadingConfig: selectedTarotCardsArr만 저장
      const combinedReadingConfigForDB = {
        selectedTarotCardsArr: combinedSelectedTarotCardsArr,
      };

      // 추가타로 _id 체인(분기 지원):
      // - 원본부터 parentTarot까지의 경로 _id를 순서대로 저장 (자기 자신 제외)
      const tarotIdChain = (pathTarotsInOrder || [])
        .map((t) => t?._id)
        .filter(Boolean);

      // originalTarotId는 위에서 이미 추출됨

      let interpretation;
      if (modelNumber === 2 || modelNumber === 3 || modelNumber === 4) {
        interpretation = await tarotCardInterpreterWithAIAPI(
          {
            ...inputQuestionData,
            readingConfig: inputQuestionData.readingConfig, // 원본 readingConfig 유지
            combinedReadingConfig: combinedReadingConfigForAI, // AI 해석용 누적 카드 전달
            isAdditionalQuestion: true,
            previousContext: previousContext,
            isCustomInterpretationFromGeneralReading:
              inputQuestionData?.isCustomInterpretationFromGeneralReading === true,
          },
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

      // MongoDB 트랜잭션 시작
      // MongoDBトランザクション開始
      // Start MongoDB transaction
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log(
              "=== 트랜잭션 시작: 추가 질문 타로 생성 → 바우처 차감 순서 ===",
            );
          }

          // 카운트 규칙
          // - 원본 타로는 additionalQuestionCount를 올리지 않는다(항상 0 유지/미보유 가능)
          // - "추가 타로" 레코드만 1부터 시작하며, 이전 카운트가 있으면 +1
          const baseCount =
            typeof inputQuestionData?.additionalQuestionCount === "number"
              ? inputQuestionData.additionalQuestionCount
              : 0;
          const nextAdditionalQuestionCount = Math.min(baseCount + 1, 2);

          // 1. 타로 생성 (실패하면 여기서 중단)
          // 1. タロット作成（失敗したらここで中止）
          // 1. Create tarot (abort here on failure)
          let updatedUserInfo;
          if (
            inputQuestionData.tarotSpreadVoucherPrice !== undefined &&
            inputQuestionData.tarotSpreadVoucherPrice !== null
          ) {
            // 바우처 모드: 타로 생성 후 바우처 차감
            // バウチャーモード: タロット作成後にバウチャー控除
            // Voucher mode: create tarot then deduct voucher
            await createTarotAndSendResponse(
              {
                ...inputQuestionData,
                readingConfig: inputQuestionData.readingConfig, // 원본 readingConfig (새 카드들만)
                combinedReadingConfig: combinedReadingConfigForDB, // DB용 combinedReadingConfig (누적 카드들)
                isAdditionalQuestion: true,
                originalTarotId: originalTarotId,
                parentTarotId: parentTarot?._id || originalTarotId || null,
                tarotIdChain: tarotIdChain,
                hasAdditionalQuestion: true,
                additionalQuestionCount: nextAdditionalQuestionCount,
              },
              interpretationWithoutQuestion,
              type,
              userInfo,
              res,
              session,
            );

            // 2. 바우처 차감 (타로 생성이 성공한 후에만 실행)
            // 2. バウチャー控除（タロット作成成功後のみ実行）
            // 2. Deduct voucher (run only after tarot creation succeeds)
            updatedUserInfo = await processVoucherConsumption(
              userInfo,
              inputQuestionData,
              session,
              modelNumber,
            );
          } else {
            // 애드몹 광고 모드: 타로 생성 후 사용자 정보 업데이트
            // アドモブ広告モード: タロット作成後にユーザー情報更新
            // AdMob ad mode: update user info after tarot creation
            await createTarotAndSendResponse(
              {
                ...inputQuestionData,
                readingConfig: inputQuestionData.readingConfig, // 원본 readingConfig (새 카드들만)
                combinedReadingConfig: combinedReadingConfigForDB, // DB용 combinedReadingConfig (누적 카드들)
                isAdditionalQuestion: true,
                originalTarotId: originalTarotId,
                parentTarotId: parentTarot?._id || originalTarotId || null,
                tarotIdChain: tarotIdChain,
                hasAdditionalQuestion: true,
                additionalQuestionCount: nextAdditionalQuestionCount,
              },
              interpretationWithoutQuestion,
              type,
              userInfo,
              res,
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

            // 광고제거 이용권 사용 여부 체크
            // 広告除去利用券の使用有無チェック
            // Check whether ads-free pass is in use
            const hasActiveAdsFreePass =
              userInfo?.adsFreePass?.name &&
              userInfo?.adsFreePass?.orderId &&
              userInfo?.adsFreePass?.expired &&
              userInfo?.adsFreePass?.name !== "" &&
              userInfo?.adsFreePass?.orderId !== "" &&
              userInfo?.adsFreePass?.expired !== "" &&
              new Date(userInfo?.adsFreePass?.expired) > new Date();

            // 무료 모드 통계 증가 (광고제거 이용권 제외)
            // 無料モード統計増加（広告除去利用券を除く）
            // Increment free mode stats (excluding ads-free pass)
            if (!hasActiveAdsFreePass) {
              updatedTarotUsageStats.free += 1;

              if (process.env.NODE_ENV === "DEVELOPMENT") {
                console.log(
                  `무료 타로 통계 증가: free=${updatedTarotUsageStats.free}`,
                );
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

          // 3. 커밋 성공 후 캐시 업데이트
          // 3. コミット成功後にキャッシュ更新
          // 3. Update cache after commit success
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log("=== Transaction commit success ===");
          }

          // 트랜잭션이 성공한 후에만 캐시 업데이트
          // トランザクション成功後のみキャッシュ更新
          // Update cache only after transaction success
          await cacheClient.del(`user:${userId}`);
          await cacheClient.del(`cache:tarot:${userId}`);
          await cacheClient.set(`user:${userId}`, updatedUserInfo, 3600); // 1시간 캐싱
        });

        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("=== Process completed ===");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.error("=== Transaction failed - rollback ===", error);
        }
        throw error;
      } finally {
        await session.endSession();
      }
    } else {
      next(
        new AppError(
          commonErrors.tarotControllerPostQuestionError,
          commonErrors.userNotFoundError,
          404,
        ),
      );
    }
  } catch (err) {
    next(new AppError(err.name, err.message, err.statusCode));
  }
}

module.exports = postAdditionalQuestionToAI;
