import React, { useEffect, useCallback } from 'react';
import styles from './TarotModal.module.scss';
import { tarotApi } from '../../api/tarotApi.jsx';
import {
  useSetTotalCardsNumber,
  useTarotCardDeck,
  useTotalCardsNumber,
} from '@/hooks';
import { useDispatch } from 'react-redux';
import {
  setIsAnswered,
  setIsDoneAnimationOfBackground,
  setIsReadyToShowDurumagi,
  setIsWaiting,
} from '../../store/booleanStore.jsx';
import { useLanguageChange } from '@/hooks';
import { QuestionTarot } from './components/QuestionTarot.jsx';
import { SpeedTarot } from './components/SpeedTarot.jsx';
import { useRewardFromPreference } from '../../components/GoogleAd/hooks/useRewardFromPreference.jsx';
import { isAdsFreePassValid } from '../../lib/user/isAdsFreePassValid.jsx';
import { onSubmit } from './lib/onSubmit.jsx';

const TarotModal = ({
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  userInfo,
  setAdmobReward,
  isInstructionOpen,
  setInstructionOpen,
  setQuestionKind,
  ...props
}) => {
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    tarotSpreadPricePoint,
    tarotSpreadVoucherPrice,
    selectedCardPosition,
    isVoucherModeOn,
    isPending,
    suppressSubmitUntilRef,
    isStarMode,
    ...rest
  } = stateGroup;

  const {
    updateAnswerForm,
    updateCardForm,
    updateQuestionForm,
    updateModalForm,
    setSelectedTarotMode,
    setIsCSSInvisible,
    updateCountry,
    updateTarotManualModalOpen,
    setSelectedAdType,
    setWatchedAd,
    setFilledInTheQuestion,
    setSelectedCardPosition,
    ...rest2
  } = setStateGroup;

  const browserLanguage = useLanguageChange();
  const dispatch = useDispatch();
  const tarotCardDeck = useTarotCardDeck();
  const totalCardsNumber = useTotalCardsNumber();
  const setTotalCardsNumber = useSetTotalCardsNumber();

  useEffect(() => {
    setTotalCardsNumber(questionForm?.cardCount);
  }, [questionForm?.cardCount, setTotalCardsNumber]);

  useEffect(() => {
    if (tarotCardDeck?.length === 78) {
      updateCardForm({
        ...cardForm,
        selectedCardIndexList: [],
      });
    }
    return () => {};
  }, [tarotCardDeck]);

  // 이전 totalCardsNumber를 추적하기 위한 ref
  const prevTotalCardsNumberRef = React.useRef(totalCardsNumber);

  useEffect(() => {
    // totalCardsNumber가 실제로 변경되었을 때만 실행
    if (prevTotalCardsNumberRef.current !== totalCardsNumber) {
      updateCardForm({ ...cardForm, spread: false, shuffle: 0 });
      prevTotalCardsNumberRef.current = totalCardsNumber;
    }
    return () => {};
  }, [totalCardsNumber]);

  const guardedOnSubmit = useCallback(
    (...args) => {
      try {
        const now = Date.now();
        const until = suppressSubmitUntilRef?.current || 0;
        if (now < until) {
          const e = args?.[0];
          if (e && typeof e.preventDefault === 'function') e.preventDefault();
          return;
        }
      } catch (error) {
        // fail-open: if guard fails, do not block normal submit
      }
      return onSubmit(...args);
    },
    [suppressSubmitUntilRef]
  );

  return (
    <>
      {selectedTarotMode === 1 ? (
        <SpeedTarot
          styles={styles}
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
          toggleModalGroup={toggleModalGroup}
          handleStateGroup={handleStateGroup}
          userInfo={userInfo}
        />
      ) : null}
      {selectedTarotMode === 2 ||
      selectedTarotMode === 3 ||
      selectedTarotMode === 4 ? (
        <QuestionTarot
          styles={styles}
          stateGroup={stateGroup}
          setStateGroup={setStateGroup}
          toggleModalGroup={toggleModalGroup}
          onSubmit={guardedOnSubmit}
          onSubmitParam={{
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
            setDoneAnimationOfBackground: setStateGroup?.setDoneAnimationOfBackground,
            setReadyToShowDurumagi: setStateGroup?.setReadyToShowDurumagi,

            // Form data
            questionForm,
            answerForm, // 추가 질문 정보를 가져오기 위해 추가

            // User and app state
            userInfo,
            selectedTarotMode,
            isVoucherModeOn,
            tarotSpreadVoucherPrice,
            browserLanguage,
            isStarMode: isStarMode !== undefined && isStarMode !== null ? isStarMode : false,

            // Props
            props,

            // APIs and utilities
            tarotApi,
            isAdsFreePassValid,

            // Loading state
            setIsInterpretationLoading:
              setStateGroup?.setIsInterpretationLoading,

            // Redux store data for updating tarotHistory
            tarotHistoryForRedux: stateGroup?.tarotHistoryForRedux,

            // Cancel/click-through suppression window (set by Home.jsx on SpreadModal cancel)
            suppressSubmitUntilRef,
          }}
          handleStateGroup={handleStateGroup}
          isInstructionOpen={isInstructionOpen}
          setInstructionOpen={setInstructionOpen}
          setQuestionKind={setQuestionKind}
        />
      ) : null}
    </>
  );
};

export default TarotModal;
