export const findQuestionsOfTopic = (
  tarotHistory,
  questionTopic,
  browserLanguage
) => {
  const questionsWithDates = [];

  tarotHistory?.forEach(tarot => {
    // 언어 필터링
    if (tarot.language !== browserLanguage) return;

    // 주제가 비어있으면 제외
    const topic = tarot?.questionData?.question_topic;
    if (!topic || topic === '' || topic === undefined) return;

    // 선택된 주제와 일치하는지 확인
    if (topic !== questionTopic) return;

    // 실제 타로 카드 데이터가 있는지 확인
    if (
      !tarot?.readingConfig?.selectedTarotCardsArr ||
      tarot?.readingConfig?.selectedTarotCardsArr?.length === 0
    )
      return;

    // 질문 추가
    const question = tarot?.questionData?.question;
    if (question && question !== '' && question !== undefined) {
      questionsWithDates.push({
        question: question,
        updatedAt: tarot.updatedAt,
      });
    }
  });

  // 최신순으로 정렬하고 질문만 추출
  return questionsWithDates
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(item => item.question);
};
