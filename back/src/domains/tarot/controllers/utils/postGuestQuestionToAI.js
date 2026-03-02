const tarotCardInterpreterWithAIAPI = require("../../../../AI/tarotCardInterpreterWithAIAPI.js");
const GuestTarot = require("../../models/guestTarot.js");
const processInterpretation = require("../utils/processInterpretation.js");
const AppError = require("../../../../common/errors/AppError.js");
const { normalizeTarotPayload } = require("./normalizeTarotPayload.js");

async function postGuestQuestionToAI(req, res, next) {
  try {
    const { deviceId, ...rawInputQuestionData } = req.body;
    // 게스트 경로도 동일한 정규화 단계를 거쳐 공개 코드 구조와 서버 처리 구조를 분리한다.
    // ゲスト経路でも同じ正規化段階を通し、公開コード構造とサーバー処理構造を分離する。
    // The guest path uses the same normalization step to separate public-code structure from server processing structure.
    const inputQuestionData = normalizeTarotPayload(rawInputQuestionData);

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required for guest mode.",
      });
    }

    // 1. 이미 사용한 기록이 있는지 확인
    // 1. 既に使用した記録があるか確認
    // 1. Check if usage record already exists
    const existingUsage = await GuestTarot.findOne({ deviceId });
    if (existingUsage) {
      // 이미 사용했으면 에러(또는 제한 알림) 반환
      return res.status(403).json({
        success: false,
        message: "Guest mode limit reached. Please login.",
        isLimitReached: true,
      });
    }

    // 2. 모델 번호 2 (Standard/Normal)로 고정 (게스트 모드는 무료니까 보통 Normal만 제공하거나 기획에 따름)
    // 기획서상 '게스트 타로 모드'라고만 되어있으므로 Normal(2)을 사용한다고 가정.
    // 2. モデル番号2(Standard/Normal)に固定（ゲストは無料のため通常Normalのみ提供または企画に準拠）
    // 2. Fix model number to 2 (Standard/Normal); guest mode is free so typically only Normal is provided per spec
    const modelNumber = 2;

    // 3. AI 해석 요청
    const interpretation = await tarotCardInterpreterWithAIAPI(
      { ...inputQuestionData },
      modelNumber,
    );

    const interpretationWithoutQuestion = processInterpretation(
      interpretation,
      inputQuestionData,
    );

    // 4. GuestTarot DB에 저장
    // 4. GuestTarotをDBに保存
    // 4. Save GuestTarot to DB
    const newGuestTarot = new GuestTarot({
      deviceId,
      questionData: inputQuestionData.questionData,
      readingConfig: inputQuestionData.readingConfig,
      readingType: "guest_" + require("../../../../config/readingTypeConfig.js").getGuestReadingType(),
      language: inputQuestionData.language,
      interpretation: interpretationWithoutQuestion,
    });

    await newGuestTarot.save();

    // 5. 응답 반환
    // 5. レスポンス返却
    // 5. Return response
    res.status(200).json({
      success: true,
      tarot: newGuestTarot,
      isGuest: true,
    });
  } catch (error) {
    console.error("Guest Tarot Error:", error);
    next(new AppError("GuestTarotError", "Failed to process guest tarot", 500));
  }
}

module.exports = postGuestQuestionToAI;
