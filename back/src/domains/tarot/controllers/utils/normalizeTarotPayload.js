// 프론트에서 의미를 감춘 전송 포맷을 서버에서 실제 처리용 구조로 복원한다.
// フロントで意味を隠した送信フォーマットを、サーバー側で実処理用構造へ復元する。
// The server restores the opaque frontend transport format into the real processing structure.
function decodeQuestionData(questionData = {}) {
  if (Array.isArray(questionData?.a)) {
    const arr = questionData.a;
    const options = Array.isArray(questionData?.b) ? questionData.b : [];
    return {
      question_topic: arr?.[0] ?? "",
      subject: arr?.[1] ?? "",
      object: arr?.[2] ?? "",
      relationship_subject: arr?.[3] ?? "",
      relationship_object: arr?.[4] ?? "",
      theme: arr?.[5] ?? "",
      situation: arr?.[6] ?? "",
      question: arr?.[7] ?? "",
      firstOption: options?.[0] ?? "",
      secondOption: options?.[1] ?? "",
      thirdOption: options?.[2] ?? "",
    };
  }
  return questionData || {};
}

function decodeReadingConfig(readingConfig = {}) {
  if (Array.isArray(readingConfig?.a)) {
    const arr = readingConfig.a;
    const cards = Array.isArray(readingConfig?.b) ? readingConfig.b : [];
    return {
      spreadTitle: arr?.[0] ?? "",
      cardCount: arr?.[1] ?? 0,
      spreadListNumber: arr?.[2] ?? 0,
      selectedTarotCardsArr: cards,
    };
  }
  return readingConfig || {};
}

function normalizeTarotPayload(input = {}) {
  return {
    ...input,
    questionData: decodeQuestionData(input?.questionData),
    readingConfig: decodeReadingConfig(input?.readingConfig),
  };
}

module.exports = {
  normalizeTarotPayload,
};
