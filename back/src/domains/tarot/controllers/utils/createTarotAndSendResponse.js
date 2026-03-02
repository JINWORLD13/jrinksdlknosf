const { tarotService } = require("../../services");
const { commonErrors, wrapError } = require("../../../../common/errors");

function hasRealCardStrings(arr) {
  return (
    Array.isArray(arr) &&
    arr.some((v) => typeof v === "string" && v.trim().length > 0)
  );
}

async function createTarotAndSendResponse(
  inputQuestionData,
  interpretation,
  type,
  userId,
  res,
  session = null,
) {
  const timeOfCounselling = inputQuestionData?.time;

  // Ensure combinedReadingConfig always has the selected cards for original readings too.
  const spreadCardsArr =
    inputQuestionData?.readingConfig?.selectedTarotCardsArr;
  const incomingCombinedCardsArr =
    inputQuestionData?.combinedReadingConfig?.selectedTarotCardsArr;
  const resolvedCombinedCardsArr = hasRealCardStrings(incomingCombinedCardsArr)
    ? incomingCombinedCardsArr
    : Array.isArray(spreadCardsArr)
      ? spreadCardsArr
      : [];
  const resolvedCombinedReadingConfig = {
    ...(inputQuestionData?.combinedReadingConfig || {}),
    selectedTarotCardsArr: resolvedCombinedCardsArr,
  };

  const newTarotInfo = {
    ...inputQuestionData,
    interpretation: interpretation,
    readingType: type,
    userId,
    timeOfCounselling,
    combinedReadingConfig: resolvedCombinedReadingConfig,
    // 기본값 설정: 추가 질문이 아닌 경우 0, 추가 질문인 경우도 0 (원본 타로에 카운트 저장)
    additionalQuestionCount: inputQuestionData?.additionalQuestionCount ?? 0,
    hasAdditionalQuestion: inputQuestionData?.hasAdditionalQuestion ?? false,
    originalTarotId: inputQuestionData?.originalTarotId || null,
    parentTarotId: inputQuestionData?.parentTarotId || null,
    tarotIdChain: Array.isArray(inputQuestionData?.tarotIdChain)
      ? inputQuestionData.tarotIdChain
      : [],
  };
  const newTarot = await tarotService.createTarot(newTarotInfo, session);

  if (!newTarot) {
    throw wrapError(
      new Error("Failed to create tarot reading"),
      commonErrors.tarotServiceCreateTarotError,
      { statusCode: 500 },
    );
  }

  const {
    _id,
    questionData,
    readingConfig,
    combinedReadingConfig,
    interpretation,
    language,
    createdAt,
    updatedAt,
    additionalQuestionCount,
    hasAdditionalQuestion,
    originalTarotId,
    parentTarotId,
    tarotIdChain,
    ...rest
  } = newTarot;

  // & 즉각적인 답이 필요하니 post에 결과 전송
  const responseData = {
    _id,
    questionData,
    readingConfig,
    // Always return a stable combinedReadingConfig (even for original readings)
    combinedReadingConfig:
      combinedReadingConfig && typeof combinedReadingConfig === "object"
        ? combinedReadingConfig
        : resolvedCombinedReadingConfig,
    interpretation,
    language,
    createdAt,
    updatedAt,
    timeOfCounselling,
    additionalQuestionCount: additionalQuestionCount ?? 0,
    hasAdditionalQuestion: hasAdditionalQuestion ?? false,
    originalTarotId: originalTarotId || null,
    parentTarotId: parentTarotId || null,
    tarotIdChain: Array.isArray(tarotIdChain) ? tarotIdChain : [],
  };

  if (res) {
    res.status(200).json(responseData);
  }

  return responseData;
}

module.exports = createTarotAndSendResponse;
