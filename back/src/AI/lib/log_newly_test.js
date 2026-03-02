const {
  assistantCommandFirst,
  assistantCommandForAskingForForm,
  assistantCommandForAskingForRule,
} = require("../command/assistantCommand");
const {
  userCommandFirst,
  userCommandForAsking,
  userCommandForAskingForForm,
  userCommandForAskingForRule,
  userCommandForAskingForRuleForAds,
  userCommandForAskingForFormForAds,
  userCommandForAskingForFormOfOneCard,
  userCommandForAskingForRuleOfOneCard,
} = require("../command/userCommand");

const log = {
  logValuesOfTokensForClaude: (
    input_price_per_1k,
    output_price_per_1k,
    KRWPerDollar,
    msg
  ) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("토큰수 계산 : ", msg?.usage);

      const regularInputTokens = msg?.usage?.input_tokens || 0;
      const cacheCreateTokens = msg?.usage?.cache_creation_input_tokens || 0;
      const cacheReadTokens = msg?.usage?.cache_read_input_tokens || 0;
      const outputTokens = msg?.usage?.output_tokens || 0;

      // 캐시 생성은 1h 캐시 기준 2배, 캐시 읽기는 0.1배
      const cache_write_multiplier = 2.0; // 1h cache
      const cache_read_multiplier = 0.1;

      const regularInputCost = regularInputTokens * input_price_per_1k * 0.001;
      const cacheCreateCost =
        cacheCreateTokens * input_price_per_1k * 0.001 * cache_write_multiplier;
      const cacheReadCost =
        cacheReadTokens * input_price_per_1k * 0.001 * cache_read_multiplier;
      const outputCost = outputTokens * output_price_per_1k * 0.001;

      console.log("인풋값 계산 (일반):", regularInputCost.toFixed(6), "달러");
      if (cacheCreateTokens > 0) {
        console.log(
          `인풋값 계산 (캐시 생성 ${cacheCreateTokens} tokens, ${cache_write_multiplier}배):`,
          cacheCreateCost.toFixed(6),
          "달러"
        );
      }
      if (cacheReadTokens > 0) {
        console.log(
          `인풋값 계산 (캐시 읽기 ${cacheReadTokens} tokens, ${cache_read_multiplier}배):`,
          cacheReadCost.toFixed(6),
          "달러"
        );
      }
      console.log("아웃풋값 계산 :", outputCost.toFixed(6), "달러");

      const totalCost =
        regularInputCost + cacheCreateCost + cacheReadCost + outputCost;
      const totalCostKRW = totalCost * KRWPerDollar;

      console.log("토탈값 계산 :", totalCost.toFixed(6), "달러");
      console.log(
        `토탈값 원화환산 계산(환율 : ${KRWPerDollar}원 / 달러) :`,
        totalCostKRW.toFixed(2),
        "원"
      );
    }
  },
  logValuesOfTokens: (
    input_price_per_1k,
    output_price_per_1k,
    KRWPerDollar,
    completion
  ) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("토큰수 계산 : ", completion?.usage);
      console.log(
        "인풋값 계산 : ",
        completion?.usage?.prompt_tokens * input_price_per_1k * 0.001,
        "달러"
      );
      console.log(
        "아웃풋값 계산 : ",
        completion?.usage?.completion_tokens * output_price_per_1k * 0.001,
        "달러"
      );
      console.log(
        "토탈값 계산 : ",
        completion?.usage?.prompt_tokens * input_price_per_1k * 0.001 +
          completion?.usage?.completion_tokens * output_price_per_1k * 0.001,
        "달러"
      );
      console.log(
        `토탈값 원화환산 계산(환율 : ${KRWPerDollar}원 / 달러) : `,
        completion?.usage?.prompt_tokens *
          input_price_per_1k *
          0.001 *
          KRWPerDollar +
          completion?.usage?.completion_tokens *
            output_price_per_1k *
            0.001 *
            KRWPerDollar,
        "원"
      );
    }
  },
  logSysAndUserCommand: (
    questionInfo,
    spreadInfo,
    comments,
    occupation,
    careerPath,
    decisionMaking,
    drawnCards,
    whichTarot,
    isOwned,
    language
  ) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("user1 : ", userCommandFirst(language));
      console.log("assistant1 : ", assistantCommandFirst(language));
      console.log(
        "user2 : ",
        userCommandForAsking(
          questionInfo,
          spreadInfo,
          comments,
          occupation,
          careerPath,
          decisionMaking,
          drawnCards
        )
      );
      console.log("assistant2 : ", assistantCommandForAskingForForm(language));
      console.log(
        "user3 : ",
        userCommandForAskingForForm(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language
        )
      );
      console.log("assistant3 : ", assistantCommandForAskingForRule(language));
      console.log(
        "user4 : ",
        userCommandForAskingForRule(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language,
          whichTarot,
          isOwned
        )
      );
      console.log(
        "assiatant4 : ",
        "Okay. Before proceeding, I'd like to inquire about the format of the response again."
      );
      console.log(
        "user5 : ",
        userCommandForAskingForForm(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language
        )
      );
      console.log("assiatant5 : ", "Ok. Let me answer now.");
    }
  },
  logSysAndUserCommandForOneCard: (
    questionInfo,
    spreadInfo,
    comments,
    occupation,
    careerPath,
    decisionMaking,
    drawnCards,
    whichTarot,
    isOwned,
    language
  ) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("user1 : ", userCommandFirst(language));
      console.log("assistant1 : ", assistantCommandFirst(language));
      console.log(
        "user2 : ",
        userCommandForAsking(
          questionInfo,
          spreadInfo,
          comments,
          occupation,
          careerPath,
          decisionMaking,
          drawnCards
        )
      );
      console.log("assistant2 : ", assistantCommandForAskingForForm(language));
      console.log(
        "user3 : ",
        userCommandForAskingForFormOfOneCard(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language
        )
      );
      console.log("assistant3 : ", assistantCommandForAskingForRule(language));
      console.log(
        "user4 : ",
        userCommandForAskingForRuleOfOneCard(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language,
          whichTarot,
          isOwned
        )
      );
      console.log(
        "assiatant4 : ",
        "Okay. Before proceeding, I'd like to inquire about the format of the response again."
      );
      console.log(
        "user5 : ",
        userCommandForAskingForFormOfOneCard(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language
        )
      );
      console.log("assiatant5 : ", "Ok. Let me answer now.");
    }
  },
  logSysAndUserCommandForAds: (
    questionInfo,
    spreadInfo,
    comments,
    occupation,
    careerPath,
    decisionMaking,
    drawnCards,
    whichTarot,
    isOwned,
    language
  ) => {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("user1 : ", userCommandFirst(language));
      console.log("assistant1 : ", assistantCommandFirst(language));
      console.log(
        "user2 : ",
        userCommandForAsking(
          questionInfo,
          spreadInfo,
          comments,
          occupation,
          careerPath,
          decisionMaking,
          drawnCards
        )
      );
      console.log("assistant2 : ", assistantCommandForAskingForForm(language));
      console.log(
        "user3 : ",
        userCommandForAskingForFormForAds(
          questionInfo.question,
          spreadInfo.spreadListNumber,
          spreadInfo.selectedTarotCardsArr,
          whichTarot,
          isOwned,
          language
        )
      );
      console.log("assistant3 : ", assistantCommandForAskingForRule(language));
      console.log(
        "user4 : ",
        userCommandForAskingForRuleForAds(
          questionInfo?.question,
          spreadInfo?.selectedTarotCardsArr,
          language
        )
      );
      console.log(
        "assiatant4 : ",
        "Okay. Before proceeding, I'd like to inquire about the format of the response again."
      );
      console.log(
        "user5 : ",
        userCommandForAskingForFormForAds(
          questionInfo.question,
          spreadInfo.spreadListNumber,
          spreadInfo.selectedTarotCardsArr,
          whichTarot,
          isOwned,
          language
        )
      );
      console.log("assiatant5 : ", "Ok. Let me answer now.");
    }
  },
};

module.exports = log;
