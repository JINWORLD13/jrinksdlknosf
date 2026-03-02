import { clearSelectedTarotCards } from '../../../store/tarotCardStore.jsx';
import { Analytics, log } from '@/analytics';
import { getCountryCode } from '@/utils/country/detectCountry';
import { saveQuestionSet } from '@/utils/storage/questionHistory';
import { getCounsleeInfo } from '@/utils/storage/counsleeInfoStorage';
import { setTarotHistoryAction } from '../../../store/tarotHistoryStore.jsx';
import { resolveCombinedSpreadInfo } from '@/lib/tarot/spread/resolveCombinedSpreadInfo';
import { isDevelopmentMode } from '@/utils/constants/isDevelopmentMode.js';
import {
  buildOpaqueQuestionFromForm,
  buildOpaqueReadingFromForm,
  decodeOpaqueQuestionToObject,
  decodeOpaqueReadingToObject,
  createQuestionHistoryPayload,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

// 포트폴리오 공개 시 내부 스키마 의미를 노출하지 않기 위해 제출 직전에 opaque payload로 변환한다.
// ポートフォリオ公開時に内部スキーマの意味を露出しないため、送信直前に opaque payload へ変換する。
// To avoid exposing internal schema semantics in portfolio code, the submit flow converts data to an opaque payload right before API calls.
export const onSubmit = async (
  e,
  updatedSelectedTarotCards,
  {
    // State setters
    setSelectedAdType,
    updateQuestionForm,
    updateAnswerForm,
    setSelectedCardPosition,
    setWatchedAd,

    // Redux dispatch
    dispatch,

    // Redux actions
    setIsWaiting,
    setIsAnswered,
    setIsDoneAnimationOfBackground,
    setIsReadyToShowDurumagi,

    // Home local state setters (무료모드에서 애니메이션 플래그 리셋용)
    setDoneAnimationOfBackground,
    setReadyToShowDurumagi,

    // Form data
    questionForm,
    answerForm, // 추가 질문 정보를 가져오기 위해 추가

    // User and app state
    userInfo,
    selectedTarotMode,
    isVoucherModeOn,
    tarotSpreadVoucherPrice,
    browserLanguage,

    // Props
    props,

    // isStarMode flag
    isStarMode,

    // APIs and utilities
    tarotApi,
    isAdsFreePassValid,

    // Loading state
    setIsInterpretationLoading,
  }
) => {
  e.preventDefault(); // 이거 없애면 입력값이 서버로 전송되기 전 새로고침 됨.
  //& submit하자마자 광고 권유 창 안나오도록 하기 위함.
  setSelectedAdType(0);
  //! Preference에서 바로 reward 제거
  // await useRewardFromPreference({
  //   userInfo,
  //   selectedAdType,
  //   selectedTarotMode,
  //   isVoucherModeOn,
  //   setAdmobReward,
  // });
  const tarotCardsNameArr = updatedSelectedTarotCards.map((elem, i) => {
    return elem?.name;
  });
  const reverseStatesArr = updatedSelectedTarotCards.map((elem, i) => {
    if (elem.reversed === true) {
      return 'reversed';
    } else {
      return 'normal_direction';
    }
  });

  const cardsForSubmit = tarotCardsNameArr.map((elem, i) => {
    return elem + ' ' + '(' + reverseStatesArr[i] + ')';
  });

  const includeOptions =
    questionForm?.[PK.r2] === 201 || questionForm?.[PK.r2] === 304;
  const encodedQuestionData = buildOpaqueQuestionFromForm(
    questionForm,
    includeOptions
  );
  const encodedReadingConfig = buildOpaqueReadingFromForm(
    questionForm,
    cardsForSubmit
  );
  const questionData = decodeOpaqueQuestionToObject(encodedQuestionData);
  const readingConfig = decodeOpaqueReadingToObject(encodedReadingConfig);

  updateQuestionForm(prev => {
    return {
      ...prev,
      [PK.r1]: questionForm?.[PK.r1],
      [PK.r0]: questionForm?.[PK.r0],
      [PK.r2]: questionForm?.[PK.r2],
    };
  });

  // isNative 보통타로 무료모드: 대기/폭발 애니메이션·로딩 모달 없이 확인 모달만 띄우므로 isWaiting·로딩 설정 생략
  const isNativeFreeMode =
    selectedTarotMode === 2 &&
    !isVoucherModeOn &&
    !isAdsFreePassValid(userInfo);

  const finalizeCleanup = cleanupFn => {
    if (typeof cleanupFn === 'function') {
      try {
        cleanupFn();
      } catch (cleanupError) {
        console.error(
          'Failed to cleanup tarot API interceptors:',
          cleanupError
        );
      }
    }
  };

  const handleInterpretationAbort = cleanupFn => {
    updateAnswerForm(prev => ({
      ...prev,
      isWaiting: false,
      isSubmitted: false,
      isAnswered: false,
    }));
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(false));
    dispatch(setIsDoneAnimationOfBackground(false));
    dispatch(setIsReadyToShowDurumagi(false));
    setDoneAnimationOfBackground?.(false);
    setReadyToShowDurumagi?.(false);
    setIsInterpretationLoading?.(false);
    finalizeCleanup(cleanupFn);
  };

  // ! 카페에선 공공와이파이 때문에 블락시키자.
  let result;
  const currentTime = new Date();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // 추가 질문 정보 추출
  const isAdditionalQuestion = answerForm?.isAdditionalQuestion || false;
  const originalTarotId = answerForm?.originalTarotId || null;
  const parentTarotId = answerForm?.parentTarotId || null;
  const questionChain = answerForm?.questionChain || [];

  // 이전 질문 정보 추출 (질문 체인에서)
  const previousQuestionInfo =
    questionChain.length > 0
      ? questionChain[questionChain.length - 1]?.questionData
      : null;
  const previousAnswer =
    questionChain.length > 0
      ? questionChain[questionChain.length - 1]?.interpretation
      : null;
  const previousSpreadInfo =
    questionChain.length > 0
      ? answerForm?.readingConfig // 원본 스프레드 정보
      : null;

  const counsleeInfo = await getCounsleeInfo(userInfo?.email, browserLanguage);

  let tarotInfo = {
    //! 카드 심볼릭 키워드 어떤 모드에서도 뽑기 위함.
    isOwned:
      userInfo?.email === import.meta.env.VITE_COS1 ||
      userInfo?.email === import.meta.env.VITE_COS2 ||
      userInfo?.email === import.meta.env.VITE_COS3 ||
      userInfo?.email === import.meta.env.VITE_COS4
        ? true
        : false,
    questionData: encodedQuestionData,
    readingConfig: encodedReadingConfig,
    // tarotSpreadPricePoint: tarotSpreadPricePoint,
    tarotSpreadVoucherPrice: tarotSpreadVoucherPrice,
    language: browserLanguage,
    time: currentTime,
    formattedTime: currentTime?.toLocaleString(
      ['ko-KR', 'ja-JP', 'en-US'].find(locale =>
        locale.startsWith(browserLanguage)
      ) || 'en-US',
      {
        timeZone:
          browserLanguage === 'ko'
            ? 'Asia/Seoul'
            : browserLanguage === 'ja'
            ? 'Asia/Tokyo'
            : userTimeZone,
      }
    ),
    isVoucherModeOn:
      selectedTarotMode === 2 ? (isVoucherModeOn ? true : false) : true, //! 보통타로 무료모드에서 심층, 진지 타로 가도 그대로 무료모드 상태임.
    isStarMode: !!isStarMode,
    // 추가 질문 카운트: 서버에서 "추가 타로" 레코드의 카운트를 (기존 + 1)로 저장하기 위해 전달
    // 원본 타로는 0 유지, 추가 타로는 1부터 시작
    additionalQuestionCount: answerForm?.additionalQuestionCount ?? 0,
    // 추가 질문 정보
    isAdditionalQuestion: isAdditionalQuestion,
    originalTarotId: originalTarotId,
    parentTarotId:
      parentTarotId ||
      (questionChain.length > 0
        ? questionChain[questionChain.length - 1]?._id
        : null),
    previousQuestionInfo: previousQuestionInfo,
    previousAnswer: previousAnswer,
    previousSpreadInfo: previousSpreadInfo,
    questionChain: questionChain,
    isCustomInterpretationFromGeneralReading:
      answerForm?.isCustomInterpretationFromGeneralReading === true,
    counsleeInfo: counsleeInfo?.name || counsleeInfo?.birthDate || counsleeInfo?.gender || counsleeInfo?.nationality || counsleeInfo?.referenceNote ? counsleeInfo : undefined,
  };

  if (!isNativeFreeMode) {
    updateAnswerForm(prev => ({
      ...prev,
      isWaiting: true,
      isAnswered: false,
      isSubmitted: true,
    }));
    setIsInterpretationLoading?.(true);
  }

  if (
    selectedTarotMode === 2 &&
    (isVoucherModeOn || (!isVoucherModeOn && isAdsFreePassValid(userInfo)))
  ) {
    result = await tarotApi.postQuestionForNormalForAnthropicAPI(tarotInfo);
  }
  if (selectedTarotMode === 3) {
    result = await tarotApi.postQuestionForDeepForAnthropicAPI(tarotInfo);
  }
  if (selectedTarotMode === 4) {
    result = await tarotApi.postQuestionForSeriousForAnthropicAPI(tarotInfo);
  }

  //& 잔액 포인트 받아야 하나? 아니, DB에서 처리해서 계속 렌더해주면
  if (result?.response !== undefined && result?.response !== null) {
    setSelectedCardPosition(prev => {
      return {
        isClicked: false,
        position: -1,
      };
    });
    const parsedObj = JSON.parse(result?.response?.interpretation);

    // Firebase Analytics: 실제 타로 결과를 받았을 때만 모든 정보 추적
    const spreadType =
      readingConfig?.[PK.r0] || `spread_${readingConfig?.[PK.r2]}`;
    const startTime = tarotInfo?.time
      ? new Date(tarotInfo.time).getTime()
      : Date.now();
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000); // 초 단위

    // 타로 모드 정보
    const modeNames = {
      1: 'speed_tarot',
      2: 'normal_tarot',
      3: 'deep_tarot',
      4: 'serious_tarot',
    };
    const tarotMode =
      modeNames[selectedTarotMode] || `mode_${selectedTarotMode}`;

    // 질문 입력 여부
    const hasQuestion =
      questionData?.question && questionData.question.trim().length > 0;
    const questionLength = hasQuestion
      ? questionData.question.trim().length
      : 0;

    // 선택된 카드 정보
    const selectedCardsCount = updatedSelectedTarotCards?.length || 0;
    const reversedCardsCount =
      updatedSelectedTarotCards?.filter(card => card?.reversed)?.length || 0;

    // 타로 점 완료 추적 (모든 정보 포함)
    Analytics.tarot_read_complete(spreadType, duration);

    // 국가 코드 가져오기 (우선순위: userInfo > 브라우저 감지 > 언어 추론)
    const country = getCountryCode({
      userCountry: userInfo?.country,
      language: browserLanguage,
    });

    // 타로 컨텐츠 상세 추적 (실제로 타로를 본 경우)
    log('tarot_read_completed', {
      // 타로 모드
      tarot_mode: tarotMode,
      mode_number: selectedTarotMode,

      // 스프레드 정보
      spread_type: spreadType,
      spread_list_number: readingConfig?.[PK.r2] || 0,
      card_count: readingConfig?.[PK.r1] || 0,

      // 카드 선택 정보
      selected_cards_count: selectedCardsCount,
      reversed_cards_count: reversedCardsCount,

      // 질문 정보
      has_question: hasQuestion,
      question_length: questionLength,

      // 완료 정보
      duration_seconds: duration,
      is_voucher_mode: isVoucherModeOn || false,

      // 언어 및 국가 정보
      language: browserLanguage,
      country: country,
    });

    // 질문 입력 추적 (질문이 있는 경우)
    if (hasQuestion) {
      log('question_input', {
        question_length: questionLength,
        has_question: true,
        spread_type: spreadType,
        tarot_mode: tarotMode,
        language: browserLanguage,
        country: country,
      });
    }

    // 추가 질문인 경우 카운트 증가 및 체인 업데이트
    const shouldIncrementCount = isAdditionalQuestion;
    const currentCount = answerForm?.additionalQuestionCount || 0;
    const updatedCount = shouldIncrementCount ? currentCount + 1 : currentCount;
    const updatedQuestionChain = shouldIncrementCount
      ? [
          ...questionChain,
          {
            questionData,
            answer: parsedObj || result?.response?.interpretation,
            _id: result?.response?._id || result?.response?.id,
          },
        ]
      : questionChain;

    // 추가 질문인 경우: 서버 응답의 readingConfig에는 기존 카드 + 새 카드가 모두 포함될 수 있음
    // 프론트엔드에서는 새 카드만 표시해야 하므로 로컬 readingConfig 사용
    const finalSpreadInfo = isAdditionalQuestion
      ? {
          ...(result?.response?.readingConfig ?? readingConfig),
          [PK.c0]: readingConfig?.[PK.c0], // 새 카드만 사용
        }
      : result?.response?.readingConfig ?? readingConfig;

    // Server only stores combinedReadingConfig for additional-question records.
    // For original readings we always want combinedReadingConfig to match "this reading's cards"
    // (never carry over previous state).
    const combinedReadingConfigCandidate =
      result?.response?.combinedReadingConfig ??
      (isAdditionalQuestion ? answerForm?.combinedReadingConfig : null);

    const resolvedCombinedReadingConfig = resolveCombinedReadingConfig(
      combinedReadingConfigCandidate,
      finalSpreadInfo
    );

    updateAnswerForm({
      isGeneralReadingResult:
        answerForm?.isCustomInterpretationFromGeneralReading === true,
      questionData,
      readingConfig: finalSpreadInfo,
      answer: parsedObj || result?.response?.interpretation,
      language: result.response.language,
      timeOfCounselling: result.response.timeOfCounselling,
      createdAt: result.response.createdAt,
      updatedAt: result.response.updatedAt,
      isWaiting: false,
      isSubmitted: false,
      isAnswered: true,
      // 추가 질문 정보 유지
      isAdditionalQuestion: isAdditionalQuestion,
      originalTarotId:
        result?.response?.originalTarotId ?? originalTarotId ?? null,
      parentTarotId: result?.response?.parentTarotId ?? parentTarotId ?? null,
      combinedReadingConfig: resolvedCombinedReadingConfig,
      tarotIdChain: result?.response?.tarotIdChain ?? [],
      questionChain: updatedQuestionChain,
      additionalQuestionCount: updatedCount, // 카운트 업데이트
      // 응답에서 받은 _id 저장
      _id: result?.response?._id || result?.response?.id,
    });
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(true));
    setWatchedAd(false);
    // if (!isVoucherModeOn) setSelectedAdType(0);
    setSelectedAdType(0);

    // 로딩 모달 숨김
    setIsInterpretationLoading?.(false);

    // 추가 질문 완료 후 Redux store의 tarotHistory 업데이트
    // 이제 원본은 0 유지, "새로 생성된 타로 레코드"가 카운트를 갖는다.
    // 따라서 기존 레코드를 수정하지 말고, 새 레코드를 Redux 히스토리에 추가/업데이트한다.
    if (
      props?.tarotHistoryForRedux &&
      Array.isArray(props.tarotHistoryForRedux)
    ) {
      try {
        const newId = result?.response?._id || result?.response?.id;
        const newTarotRecord = {
          _id: newId,
          questionData,
          readingConfig: finalSpreadInfo, // 추가 질문인 경우 새 카드만 포함
          combinedReadingConfig: resolvedCombinedReadingConfig,
          answer: parsedObj || result?.response?.interpretation,
          language: result.response.language,
          timeOfCounselling: result.response.timeOfCounselling,
          createdAt: result.response.createdAt,
          updatedAt: result.response.updatedAt,
          hasAdditionalQuestion: shouldIncrementCount ? true : false,
          originalTarotId:
            result?.response?.originalTarotId ?? originalTarotId ?? null,
          parentTarotId:
            result?.response?.parentTarotId ?? parentTarotId ?? null,
          additionalQuestionCount: shouldIncrementCount ? updatedCount : 0,
          tarotIdChain: result?.response?.tarotIdChain ?? [],
        };

        const updatedTarotHistory = [
          ...props.tarotHistoryForRedux.filter(t => {
            const id = t?._id || t?.id;
            return !newId || id?.toString() !== newId?.toString();
          }),
          newTarotRecord,
        ];

        // Redux store 업데이트 (MyPage가 stale 상태여도 바로 반영되게)
        dispatch(setTarotHistoryAction(updatedTarotHistory));
      } catch (error) {
        console.error('Failed to update tarotHistory in Redux:', error);
      }
    }

    // 질문 히스토리 저장
    if (questionData?.question && questionData.question.trim().length > 0) {
      try {
        await saveQuestionSet(
          createQuestionHistoryPayload({
            questionData,
            readingConfig,
            language: browserLanguage,
          }),
          userInfo?.id
        );
      } catch (error) {
        console.error('Failed to save question history:', error);
      }
    }

    finalizeCleanup(result?.cleanup);

    //! API 응답 성공 후 Redux store의 선택된 카드 초기화
    // dispatch(clearSelectedTarotCards()); // 나중에 초기화되므로 여기서는 불필요
  } else if (result?.isCanceled) {
    handleInterpretationAbort(result?.cleanup);
    return;
  } else if (result !== undefined) {
    handleInterpretationAbort(result?.cleanup);
    return;
  }

  if (
    selectedTarotMode === 2 &&
    !isVoucherModeOn &&
    !isAdsFreePassValid(userInfo)
  ) {
    // Preserve additional-question chain context if we're currently in additional-question flow.
    // In native normal-tarot free mode, we intentionally don't have an interpreted record yet,
    // but we still must keep linking fields so the *later* ad-unlock interpretation call can
    // create the correct additional-question record.
    const preservedChain = isAdditionalQuestion
      ? {
          isAdditionalQuestion: true,
          originalTarotId: originalTarotId ?? null,
          parentTarotId: parentTarotId ?? null,
          tarotIdChain: Array.isArray(answerForm?.tarotIdChain)
            ? answerForm.tarotIdChain
            : [],
          questionChain: Array.isArray(questionChain) ? questionChain : [],
          additionalQuestionCount:
            typeof answerForm?.additionalQuestionCount === 'number'
              ? answerForm.additionalQuestionCount
              : 0,
          // Ensure we at least have original cards in combinedReadingConfig even for originals.
          combinedReadingConfig: answerForm?.combinedReadingConfig ?? {
            [PK.c0]: answerForm?.readingConfig?.[PK.c0] || [],
          },
        }
      : {
          isAdditionalQuestion: false,
          originalTarotId: null,
          parentTarotId: null,
          tarotIdChain: [],
          questionChain: [],
          additionalQuestionCount: 0,
          combinedReadingConfig: {
            [PK.c0]: readingConfig?.[PK.c0] || [],
          },
        };

    updateAnswerForm({
      // IMPORTANT:
      // In free mode we intentionally do NOT have an interpreted record yet.
      // If _id/id from a previous reading remains in state, AnswerModal will hide
      // the "view ads for interpretation" button in native free mode.
      isGeneralReadingResult: false,
      _id: null,
      id: null,
      questionData,
      readingConfig,
      answer: '',
      language: tarotInfo.language,
      timeOfCounselling: tarotInfo.time,
      createdAt: '',
      updatedAt: '',
      isWaiting: false,
      isSubmitted: false,
      isAnswered: true,
      ...preservedChain,
    });
    dispatch(setIsWaiting(false));
    dispatch(setIsAnswered(true));
    dispatch(setIsDoneAnimationOfBackground(false));
    dispatch(setIsReadyToShowDurumagi(false));
    // Home 로컬 상태도 리셋 (이전 이용권/광고 시청 세션의 플래그가 남아 폭발 애니메이션이 무료모드에서 잘못 실행되는 현상 방지)
    setDoneAnimationOfBackground?.(false);
    setReadyToShowDurumagi?.(false);
    setWatchedAd(false);
    // if (!isVoucherModeOn) setSelectedAdType(0);
    setSelectedAdType(0);

    // 로딩 모달 숨김
    setIsInterpretationLoading?.(false);

    // 질문 히스토리 저장 (무료모드)
    if (questionData?.question && questionData.question.trim().length > 0) {
      try {
        await saveQuestionSet(
          createQuestionHistoryPayload({
            questionData,
            readingConfig,
            language: browserLanguage,
          }),
          userInfo?.id
        );
      } catch (error) {
        console.error('Failed to save question history:', error);
      }
    }
  }
};
