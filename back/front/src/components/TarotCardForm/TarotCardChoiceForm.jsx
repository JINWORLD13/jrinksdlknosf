// Import 섹션
// インポートセクション
// Import section
import React, { useEffect, useMemo, useState } from 'react';
import styles from './TarotCardChoiceForm.module.scss';
import { backImagePath } from '../../data/images/images.jsx';
import { useTranslation } from 'react-i18next';
import { useTarotCardDeck, useTotalCardsNumber } from '@/hooks';
import { useDispatch } from 'react-redux';
import {
  drawCard,
  setSelectedTarotCards,
} from '../../store/tarotCardStore.jsx';
import { setIsWaiting } from '../../store/booleanStore.jsx';
import CancelButton from '../common/CancelButton.jsx';
import { useLanguageChange } from '@/hooks';
import { useWindowSizeState } from '@/hooks';
import {
  getTodayCard,
  setTodayCard,
} from '../../utils/storage/tokenLocalStorage.jsx';
import {
  getTodayCardForNative,
  setTodayCardForNative,
} from '../../utils/storage/tokenPreference.jsx';
import { Capacitor } from '@capacitor/core';
import { tarotDeck } from '../../data/TarotCardDeck/TarotCardDeck.jsx';
import CardRow from './CardRow.jsx';
import { resolveCombinedCardsArr } from '@/lib/tarot/spread/resolveCombinedSpreadInfo';

// 네이티브 플랫폼 여부 확인 (iOS/Android)
// ネイティブプラットフォームかどうか確認（iOS/Android）
// Check if native platform (iOS/Android)
const isNative = Capacitor.isNativePlatform();

const TarotCardChoiceForm = props => {
  // Hook 및 Redux 초기화
  // HookとRedux初期化
  // Hook and Redux initialization
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let tarotCardDeck = useTarotCardDeck();
  const totalCardsNumber = useTotalCardsNumber(); // 선택해야 할 카드 수
  const browserLanguage = useLanguageChange(); // 현재 언어

  // ============================================
  // 📝 Props 구조 분해 - State Group
  // ============================================
  const {
    answerForm, // 답변 폼 상태
    cardForm, // 카드 선택 폼 상태 (selectedCardIndexList 포함)
    questionForm, // 질문 폼 상태
    modalForm, // 모달 상태
    selectedTarotMode, // 타로 타입 (1: 예스노, 2-4: 다른 스프레드)
    isCSSInvisible, // CSS 숨김 상태
    country, // 국가 정보
    ...restOfStateGroup
  } = props?.stateGroup;

  // ============================================
  // 🔧 Props 구조 분해 - SetState Group
  // ============================================
  const {
    updateAnswerForm, // 답변 폼 업데이트
    updateCardForm, // 카드 폼 업데이트
    updateQuestionForm, // 질문 폼 업데이트
    updateModalForm, // 모달 업데이트
    setSelectedTarotMode, // 타로 타입 업데이트
    setIsCSSInvisible, // CSS 숨김 상태 업데이트
    updateCountry, // 국가 정보 업데이트
    setSelectedCardPosition, // 선택한 카드 위치 설정
    ...restOfSetStateGroup
  } = props?.setStateGroup;

  // ============================================
  // 🎭 Props 구조 분해 - Toggle Modal Group
  // ============================================
  const {
    toggleSpreadModal = () => {}, // 스프레드 모달 토글
    toggleTarotModal = () => {}, // 타로 모달 토글
    ...restOfToggleModalGroup
  } = props?.toggleModalGroup || {};

  // ============================================
  // 🎬 Props 구조 분해 - Handle State Group
  // ============================================
  const {
    handleAnsweredState, // 답변 상태 처리
    handleCardForm, // 카드 폼 처리
    handleQuestionForm, // 질문 폼 처리
    handleResetAll, // 전체 리셋
    handleResetDeck, // 덱 리셋
    handleReadyToShuffleValue, // 셔플 준비 상태
    handleSpreadValue, // 스프레드 값 처리
    handleSelectedTarotMode, // 타로 타입 처리
    ...restOfHandleStateGroup
  } = props?.handleStateGroup;

  // ============================================
  // 💾 오늘의 카드 인덱스 State (로컬 저장소에서 가져오기)
  // ============================================
  // props.from === 1 일 때만 사용 (오늘의 타로 운세)
  // 사용자가 하루에 한 번만 카드를 뽑을 수 있도록 저장된 카드 인덱스 관리
  const [todayCardIndexInLocalStorage, setTodayCardIndexInLocalStorage] =
    useState(() => {
      // 1. props로 전달된 오늘의 카드 인덱스가 있으면 그것을 사용
      if (
        props?.todayCardIndex !== null &&
        props?.todayCardIndex !== undefined
      ) {
        return props?.todayCardIndex;
      }

      // 2. 웹 환경: localStorage에서 오늘의 카드 가져오기
      if (!isNative) {
        const webCard = getTodayCard(props?.userInfo);
        return webCard;
      }

      // 3. 네이티브 환경: useEffect에서 비동기로 가져올 예정
      if (isNative) {
        return null;
      }
    });

  // ============================================
  // useEffect: props.todayCardIndex 동기화
  // ============================================
  // 부모에서 todayCardIndex가 변경되면 내부 state 동기화
  useEffect(() => {
    if (props?.todayCardIndex !== null && props?.todayCardIndex !== undefined) {
      setTodayCardIndexInLocalStorage(props?.todayCardIndex);
    }
  }, [props?.todayCardIndex]);

  // ============================================
  // useEffect: 오늘의 카드 로드 및 동기화
  // ============================================
  // props.from === 1 (오늘의 타로 운세)일 때 실행
  // 네이티브/웹 환경에 따라 다른 저장소에서 오늘의 카드를 가져옴
  useEffect(() => {
    // 네이티브 환경에서 비동기로 오늘의 카드 가져오기
    const fetchTodayCard = async () => {
      try {
        // Preferences API를 사용하여 저장된 오늘의 카드 인덱스 가져오기
        const index = await getTodayCardForNative(props?.userInfo);

        // localStorage와 state를 항상 동기화
        // 날짜가 바뀌어서 localStorage가 null이면 state도 null로 업데이트
        if (index !== null && index !== undefined) {
          setTodayCardIndexInLocalStorage(index);
        } else {
          // localStorage에 오늘의 카드가 없으면 state도 null로 동기화
          setTodayCardIndexInLocalStorage(null);
        }
      } catch (error) {
        // 오류 발생 시 조용히 처리
      }
    };

    // 네이티브 환경: 조건이 충족되면 오늘의 카드 가져오기
    if (
      props?.from === 1 &&
      props?.isClickedForTodayCard &&
      isNative &&
      props?.userInfo?.email !== '' &&
      props?.userInfo?.email !== undefined &&
      todayCardIndexInLocalStorage === null // 이미 값이 있으면 fetch 안함!
    ) {
      fetchTodayCard();
    }

    // 웹 환경: localStorage에서 오늘의 카드 가져오기
    if (
      props?.from === 1 &&
      props?.isClickedForTodayCard &&
      !isNative &&
      props?.userInfo?.email !== '' &&
      props?.userInfo?.email !== undefined
    ) {
      const storedIndex = getTodayCard(props?.userInfo);
      // localStorage와 state를 항상 동기화
      // 날짜가 바뀌어서 localStorage가 null이면 state도 null로 업데이트
      if (storedIndex !== null && storedIndex !== undefined) {
        setTodayCardIndexInLocalStorage(storedIndex);
      } else {
        // localStorage에 오늘의 카드가 없으면 state도 null로 동기화
        setTodayCardIndexInLocalStorage(null);
      }
    }
  }, [
    isNative,
    props?.isClickedForTodayCard,
    props?.userInfo?.email,
    props?.from,
    todayCardIndexInLocalStorage,
  ]);

  // ============================================
  // 오늘의 운세 전용: 카드 덱 랜덤 셔플
  // ============================================
  // props.from === 1 (오늘의 타로)일 때만 덱을 섞음
  // 매번 다른 카드가 나타나도록 Fisher-Yates 알고리즘 사용
  if (props?.from === 1) {
    const shuffleArray = array => {
      const newArray = [...array]; // 원본 배열 복사
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // 배열 요소 교환 (Fisher-Yates shuffle)
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    tarotCardDeck = shuffleArray(tarotDeck);
  }

  // ============================================
  // handleOnSubmit: 카드 선택 완료 후 제출 처리
  // ============================================
  // 필요한 카드를 모두 선택하면 API로 전송
  //
  // React 상태 업데이트는 비동기이기 때문에:
  // handleDrawCard(8);
  // // ↓ updateCardForm 실행 (비동기 대기 중...)
  //
  // handleOnSubmit(e, 8);
  // // ↓ 이 시점에 cardForm.selectedCardIndexList는 아직 [3,15,...,75]
  // // ↓ 그래서 수동으로 8을 추가: [...selectedCardIndexList, 8]
  const handleOnSubmit = (e, actualIndex) => {
    // 취소 직후(짧은 시간) click-through로 카드 선택/submit이 튀는 케이스 방지
    // - Home.jsx에서 suppressSubmitUntilRef를 올려둔 경우, 여기서도 대기 상태 전환(closeAllModals)을 막아야
    //   "AI 요청은 안 갔는데 기다림 애니메이션만 켜지는" 현상을 막을 수 있다.
    try {
      const now = Date.now();
      const until = props?.onSubmitParam?.suppressSubmitUntilRef?.current || 0;
      if (now < until) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (e && typeof e.stopImmediatePropagation === 'function')
          e.stopImmediatePropagation();
        return;
      }
    } catch (_) {
      // fail-open: guard 실패 시 정상 동작 유지
    }

    // actualIndex는 섞인 덱에서의 배열 위치 (고유 인덱스가 아님!)
    // 현재 선택된 카드들 + 방금 선택한 카드를 합쳐서 배열 구성
    const currentIndexes = [...cardForm?.selectedCardIndexList, actualIndex];

    // 필요한 카드를 모두 선택했는지 확인
    if (totalCardsNumber === currentIndexes?.length) {
      // selectedTarotMode 2~4: 다양한 스프레드 (원카드, 쓰리카드 등)
      if (
        selectedTarotMode === 2 ||
        selectedTarotMode === 3 ||
        selectedTarotMode === 4
      ) {
        // 인덱스 배열을 실제 카드 객체 배열로 변환
        const updatedSelectedTarotCards = currentIndexes.map(shuffledIndex => {
          // shuffledIndex는 섞인 덱의 배열 위치
          return tarotCardDeck[shuffledIndex];
        });

        //! 선택한 카드들을 Redux store에 저장
        dispatch(setSelectedTarotCards(updatedSelectedTarotCards));

        // 모달 닫고 상위 컴포넌트에 선택 완료 알림
        closeAllModals();
        props?.onSubmit(e, updatedSelectedTarotCards, props?.onSubmitParam);
      }
    }
  };

  // ============================================
  // 🔒 중복 클릭 방지 State
  // ============================================
  const [isClicked, setClicked] = useState(false);

  // ============================================
  // 🎴 handleDrawCard: 카드 선택 처리
  // ============================================
  // 사용자가 카드를 클릭했을 때 호출되는 핵심 함수
  // - 오늘의 카드(from === 1): 저장소에 카드 저장
  // - 일반 스프레드: Redux에 카드 추가
  const handleDrawCard = i => {
    try {
      // 중복 클릭 방지
      if (isClicked) return;
      setClicked(true);

      // Firebase Analytics: 실제 타로 결과를 받았을 때만 추적됨 (onSubmit에서 처리)

      // ============================================
      // 📅 오늘의 카드 처리 로직 (from === 1)
      // ============================================
      if (props?.from === 1) {
        // 사용자 정보 유효성 검사 (로그 삭제 및 진행 허용)
        if (!props?.userInfo?.email) {
          // 이메일이 없어도 일시적으로 진행 허용 (UI 반응성 확보)
          // return;
        }

        // 오늘의 카드는 한 장만 선택 가능 (중복 선택 방지)
        if (cardForm?.selectedCardIndexList?.length >= 1) {
          return;
        }

        // 이미 오늘의 카드를 뽑았는지 확인
        if (
          todayCardIndexInLocalStorage !== null &&
          todayCardIndexInLocalStorage !== undefined
        ) {
          return;
        }

        // 카드 저장 로직
        // 섞인 덱에서 선택한 카드 가져오기
        const selectedCard = tarotCardDeck[i];

        // 원본 덱에서 고유 인덱스로 카드 정보 가져오기
        // (이미지는 고유 인덱스에 고정되어 있음)
        const originalCard = tarotDeck[selectedCard?.index];

        // 카드 이미지 정보 구성
        const cardImage = {
          name: originalCard?.name,
          imagePath: originalCard?.imagePath,
          reversed: selectedCard?.reversed || false,
        };

        // 저장소에 오늘의 카드 저장
        // Promise가 반환되지만 await 없이 호출 (비동기 처리)
        if (isNative) {
          // 네이티브: Preferences API에 저장
          setTodayCardForNative(
            selectedCard?.index,
            props?.userInfo,
            null,
            cardImage,
          );
        }
        if (!isNative) {
          // 웹: localStorage에 저장
          setTodayCard(selectedCard?.index, props?.userInfo, null, cardImage);
        }

        // 내부 state 즉시 업데이트 (비동기 저장과 별개로)
        setTodayCardIndexInLocalStorage(selectedCard?.index);

        // 부모 컴포넌트에 저장 완료 알림 (콜백)
        props?.onCardSaved?.(selectedCard?.index);
      }

      // 일반 스프레드만 처리 (오늘의 타로는 독립적으로 관리)
      if (props?.from !== 1) {
        // 선택한 카드 인덱스를 cardForm에 추가
        // React의 비동기 상태 업데이트로 인해 이전 상태를 spread해서 새로운 배열 생성
        updateCardForm({
          ...cardForm,
          selectedCardIndexList: [...cardForm?.selectedCardIndexList, i],
        });

        // Redux store에 카드 추가
        // 원본 덱(tarotCardDeck)은 78장 그대로 유지하고 selectedTarotCards만 업데이트
        dispatch(
          drawCard({ cardNumber: totalCardsNumber, shuffledCardIndex: i }),
        );
      }
    } catch (error) {
      // 오류 발생 시 조용히 처리
    } finally {
      // 클릭 상태 해제 (다음 클릭 가능하도록)
      setClicked(false);
    }
  };

  // ============================================
  // 🚪 closeAllModals: 모든 모달 닫기
  // ============================================
  // 카드 선택 완료 후 모든 모달을 닫고 대기 상태로 전환
  // isNative 보통타로 무료모드: 대기/폭발 애니메이션 없이 확인 모달만 띄우므로 isWaiting true 설정 생략
  const closeAllModals = () => {
    try {
      const now = Date.now();
      const until = props?.onSubmitParam?.suppressSubmitUntilRef?.current || 0;
      if (now < until) return;
    } catch (_) {
      // fail-open
    }

    const isNativeFreeMode =
      isNative &&
      selectedTarotMode === 2 &&
      props?.stateGroup?.isVoucherModeOn === false &&
      !(typeof props?.onSubmitParam?.isAdsFreePassValid === 'function'
        ? props.onSubmitParam.isAdsFreePassValid(props?.onSubmitParam?.userInfo)
        : false);

    // 스프레드 선택 모달 닫기
    toggleSpreadModal &&
      toggleSpreadModal(false, questionForm?.spreadListNumber, '', 0);

    // 답변 폼 대기 상태 설정 (무료모드에서는 애니메이션 없이 확인 모달만 띄우므로 생략)
    if (!isNativeFreeMode) {
      updateAnswerForm(prev => ({ ...prev, isWaiting: true }));
      dispatch(setIsWaiting(true));
    }

    // 타로 카드 선택 모달 닫기
    toggleTarotModal &&
      toggleTarotModal(false, questionForm?.spreadListNumber, '', 0);
  };

  // 화면 크기 정보 (반응형 레이아웃용)
  const { windowWidth, windowHeight } = useWindowSizeState();

  // ============================================
  // 추가질문 모드: 이미 사용된 카드 제외/비활성 처리
  // ============================================
  const isAdditionalQuestionMode =
    props?.from !== 1 && answerForm?.isAdditionalQuestion === true;

  const usedCardIdentity = useMemo(() => {
    if (!isAdditionalQuestionMode) {
      return { nameSet: new Set(), indexSet: new Set() };
    }
    const usedArr = resolveCombinedCardsArr(
      answerForm?.combinedReadingConfig?.selectedTarotCardsArr,
      answerForm?.readingConfig?.selectedTarotCardsArr,
    );

    const normalizeCardName = v => {
      const raw =
        typeof v === 'string'
          ? v
          : v && typeof v === 'object'
            ? (v?.name ?? v?.cardName ?? v?.title)
            : null;
      if (typeof raw !== 'string') return null;

      // 1) strip direction suffix like "(reversed)" / "(normal_direction)" or any bracketed suffix
      //    - supports common bracket variants: (), [], （）, 【】
      const withoutBracketSuffix = raw.replace(/[\s]*[\(\[（【].*$/, '');

      // 2) strip optional numbering prefixes like "0. The Fool"
      const withoutPrefix = withoutBracketSuffix.replace(
        /^\s*\d+\s*[\.\-:]\s*/,
        '',
      );

      // 3) normalize whitespace/case
      return withoutPrefix.replace(/\s+/g, ' ').trim().toLowerCase();
    };

    const nameSet = new Set();
    const indexSet = new Set();

    (Array.isArray(usedArr) ? usedArr : []).forEach(v => {
      // Prefer explicit index if present (object form)
      const explicitIndex =
        v && typeof v === 'object' && Number.isFinite(v?.index)
          ? v.index
          : null;
      if (Number.isFinite(explicitIndex)) {
        indexSet.add(explicitIndex);
      }

      const normalized = normalizeCardName(v);
      if (!normalized) return;
      nameSet.add(normalized);

      // Also derive canonical index from the static tarotDeck list (more robust than name-only matching)
      const matched = tarotDeck.find(
        c =>
          typeof c?.name === 'string' &&
          c.name.replace(/\s+/g, ' ').trim().toLowerCase() === normalized,
      );
      if (matched && Number.isFinite(matched.index)) {
        indexSet.add(matched.index);
      }
    });

    return { nameSet, indexSet };
  }, [
    isAdditionalQuestionMode,
    answerForm?.combinedReadingConfig?.selectedTarotCardsArr,
    answerForm?.readingConfig?.selectedTarotCardsArr,
  ]);

  const disabledIndexes = useMemo(() => {
    if (!isAdditionalQuestionMode) return [];
    if (!tarotCardDeck || !Array.isArray(tarotCardDeck)) return [];
    const result = [];
    tarotCardDeck.forEach((card, idx) => {
      const deckName =
        typeof card?.name === 'string'
          ? card.name.replace(/\s+/g, ' ').trim().toLowerCase()
          : null;
      const deckIndex = Number.isFinite(card?.index) ? card.index : null;

      const isUsedByIndex =
        Number.isFinite(deckIndex) && usedCardIdentity.indexSet.has(deckIndex);
      const isUsedByName = deckName && usedCardIdentity.nameSet.has(deckName);

      if (isUsedByIndex || isUsedByName) {
        result.push(idx);
      }
    });
    return result;
  }, [isAdditionalQuestionMode, tarotCardDeck, usedCardIdentity]);

  // ============================================
  // handleCardClick: 카드 클릭 이벤트 핸들러
  // ============================================
  // CardRow에서 개별 카드가 클릭되었을 때 호출
  // - actualIndex: 섞인 덱에서의 배열 위치 인덱스
  // - 오늘의 카드(from === 1)와 일반 스프레드에서 다른 처리
  const handleCardClick = (e, card, actualIndex) => {
    // 일반 스프레드 (from !== 1)
    if (props?.from !== 1) {
      // 추가질문 모드에서 이미 사용된 카드는 선택 불가
      if (isAdditionalQuestionMode && disabledIndexes.includes(actualIndex)) {
        return;
      }
      // 이미 선택된 카드는 다시 선택 불가
      if (cardForm?.selectedCardIndexList?.includes(actualIndex)) return;

      // 필요한 카드를 모두 선택했으면 모달 숨김
      if (cardForm?.selectedCardIndexList?.length === totalCardsNumber) {
        setIsCSSInvisible(true);
        return;
      }

      // 카드 선택 및 제출 처리
      handleDrawCard(actualIndex);
      handleOnSubmit(e, actualIndex);

      // 카드 위치 상태 초기화
      setSelectedCardPosition(prev => {
        return {
          ...prev,
          isClicked: false,
          position: -1,
        };
      });
    } else {
      // 오늘의 카드 (from === 1)
      // 이미 선택된 카드는 다시 선택 불가
      if (cardForm?.selectedCardIndexList?.includes(actualIndex)) return;

      // 카드 선택 처리 (제출 없이)
      handleDrawCard(actualIndex);

      // 카드 위치 상태 초기화
      setSelectedCardPosition(prev => {
        return {
          ...prev,
          isClicked: false,
          position: -1,
        };
      });
    }
  };

  // ============================================
  // handleCancelClick: 취소 버튼 핸들러
  // ============================================
  // 카드 선택을 취소하고 이전 단계로 돌아가기
  const handleCancelClick = (e = null) => {
    // 덱 리셋
    handleResetDeck();

    // 오늘의 카드가 아닌 경우에만 처리
    if (props?.from !== 1) {
      // 예스노 타로가 아닌 경우 (selectedTarotMode !== 1)
      if (selectedTarotMode !== 1) {
        // 카드 폼 초기화
        updateCardForm({
          ...cardForm,
          isShuffleFinished: false,
          selectedCardIndexList: [],
        });

        // 답변 폼을 제출 완료 상태로 설정
        updateAnswerForm(prev => {
          return {
            ...prev,
            isSubmitted: true,
          };
        });

        // 셔플 준비 상태로 전환
        handleReadyToShuffleValue(true);
      }

      // 예스노 타로인 경우 (selectedTarotMode === 1)
      if (selectedTarotMode === 1) {
        // 스프레드 모달 닫기
        handleSpreadValue(false);

        // CSS 숨김 해제
        setIsCSSInvisible(false);

        // 답변 폼 완전 초기화
        updateAnswerForm(prev => {
          return {
            ...prev,
            isSubmitted: false,
            isWaiting: false,
            isAnswered: false,
          };
        });
      }

      // 카드 위치 상태 초기화
      setSelectedCardPosition(prev => {
        return {
          isClicked: false,
          position: -1,
        };
      });
    }
  };

  // ============================================
  // 반응형 레이아웃: 카드 행 구성
  // ============================================

  // 세로 모드 (Portrait): 6행 x 13장 = 78장
  const portraitCardRows = [
    { start: 0, end: 13 },
    { start: 13, end: 26 },
    { start: 26, end: 39 },
    { start: 39, end: 52 },
    { start: 52, end: 65 },
    { start: 65, end: 78 },
  ];

  // 가로 모드 (Landscape): 3행 x 26장 = 78장
  const landscapeCardRows = [
    { start: 0, end: 26 },
    { start: 26, end: 52 },
    { start: 52, end: 78 },
  ];

  // ============================================
  // 🎨 JSX 렌더링
  // ============================================
  // 화면 방향(세로/가로)에 따라 다른 카드 레이아웃 렌더링
  return (
    <>
      {window !== 'undefined' && windowWidth <= windowHeight ? (
        // 세로 모드 (Portrait): 6행 레이아웃
        <div className={styles['choice-box']}>
          <div className={styles['cards-container']}>
            {portraitCardRows.map(({ start, end }, index) => (
              <CardRow
                key={`portrait-row-${index}`}
                cards={tarotCardDeck?.slice(start, end)} // 해당 행의 카드들만 전달
                startIndex={start} // 시작 인덱스 (실제 배열 위치)
                selectedIndexes={cardForm?.selectedCardIndexList} // 선택된 카드 인덱스 배열
                disabledIndexes={disabledIndexes}
                onCardClick={handleCardClick} // 카드 클릭 핸들러
              />
            ))}
          </div>

          {/* 취소 버튼 (오늘의 카드가 아닐 때만 표시) */}
          <div className={styles['btn-box']}>
            {props?.from !== 1 && (
              <CancelButton
                className={`${
                  browserLanguage === 'ja'
                    ? styles['btn-japanese'] // 일본어일 때 특별한 스타일
                    : styles['btn']
                }`}
                onClick={handleCancelClick}
              >
                {t(`button.cancel`)}
              </CancelButton>
            )}
          </div>
        </div>
      ) : (
        // 가로 모드 (Landscape): 3행 레이아웃
        <div className={styles['choice-box']}>
          <div className={styles['cards-container']}>
            {landscapeCardRows.map(({ start, end }, index) => (
              <CardRow
                key={`landscape-row-${index}`}
                cards={tarotCardDeck?.slice(start, end)} // 해당 행의 카드들만 전달
                startIndex={start} // 시작 인덱스 (실제 배열 위치)
                selectedIndexes={cardForm?.selectedCardIndexList} // 선택된 카드 인덱스 배열
                disabledIndexes={disabledIndexes}
                onCardClick={handleCardClick} // 카드 클릭 핸들러
              />
            ))}
          </div>

          {/* 취소 버튼 (오늘의 카드가 아닐 때만 표시) */}
          <div className={styles['btn-box']}>
            {props?.from !== 1 && (
              <CancelButton
                className={`${
                  browserLanguage === 'ja'
                    ? styles['btn-japanese'] // 일본어일 때 특별한 스타일
                    : styles['btn']
                }`}
                onClick={handleCancelClick}
              >
                {t(`button.cancel`)}
              </CancelButton>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TarotCardChoiceForm;
