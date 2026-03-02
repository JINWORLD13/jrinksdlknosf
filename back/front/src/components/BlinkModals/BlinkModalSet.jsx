import React from 'react';
import { useTranslation } from 'react-i18next';
import BlinkModal from '../../modals/BlinkModal/BlinkModal.jsx';
import { cardPositionInfo } from '../../lib/tarot/card/cardPositionInfo';
import { useLanguageChange } from '@/hooks';
import modalStyles from '../../modals/BlinkModal/BlinkModal.module.scss';

export const BlinkModalSet = ({
  stateGroup,
  setStateGroup,
  styles, // Legacy prop from pages, still respected for page-specific overrides if any exist
  ...orops
}) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();

  const {
    answerForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isVoucherModeOn,
    hasWatchedAd,
    hasWatchedAdForBlinkModal,
    selectedSpread,
    selectedCardPosition = { isClicked: false, position: -1 }, // 기본값 설정
    isReadyToShowDurumagi,
    isDoneAnimationOfBackground,
    isSpeedTarotNotificationOn,
    isSpeedTarotUnavailable,
    isLoginBlinkModalOpen,
    isCopyBlinkModalOpen,
    isSaveBlinkModalOpen,
    isChargingKRWBlinkModalOpen,
    isChargingUSDBlinkModalOpen,
    isDeleteInProgressBlinkModalOpen,
    isFilledInTheQuestion,
    isUnavailableVoucher,
    isTarotModeUnavailable,
    isQuestionOverLimit,
    isMinimumAmountBlinkModalOpen,
    isCustomReadingInsufficientBlinkModalOpen = false,
    ...restOfState
  } = stateGroup;

  const {
    updateLoginBlinkModalOpen,
    setFilledInTheQuestion,
    setTarotModeUnavailable,
    setSelectedSpread,
    setSelectedCardPosition = () => {}, // 기본값 설정
    setWatchedAdForBlinkModal,
    setSpeedTarotNotificationOn,
    setSpeedTarotUnavailable,
    updateCopyBlinkModalOpen,
    updateSaveBlinkModalOpen,
    setChargingKRWBlinkModalOpen,
    setChargingUSDBlinkModalOpen,
    updateDeleteInProgressBlinkModalOpen,
    setUnavailableVoucher,
    setQuestionOverLimit,
    updateMinimumAmountBlinkModalOpen,
    updateCustomReadingInsufficientBlinkModalOpen = () => {},
    restOfSetState,
  } = setStateGroup;

  if (selectedTarotMode === 1 && selectedSpread) {
    ['(General)', '(일반)', '(一般)'].forEach((elem, i) => {
      if (questionForm?.spreadTitle?.includes(elem))
        questionForm.spreadTitle = questionForm.spreadTitle.replace(elem, '');
    });
    ['6-day flow', '6일간의 흐름', '六日間の流れ'].forEach((elem, i) => {
      const nameArr = ['Six Cards', '여섯 장의 카드', 'シックスカード'];
      if (questionForm?.spreadTitle?.includes(elem))
        questionForm.spreadTitle = elem.replace(elem, nameArr[i]);
    });
  }

  const blinkModalInfoArr = [
    {
      state: isLoginBlinkModalOpen,
      setState: updateLoginBlinkModalOpen,
      stateName: 'isLoginBlinkModalOpen',
      setStateName: 'updateLoginBlinkModalOpen',
      translation: 'login',
      className: null,
      condition: isLoginBlinkModalOpen,
    },
    {
      state: isCopyBlinkModalOpen,
      setState: updateCopyBlinkModalOpen,
      stateName: 'isCopyBlinkModalOpen',
      setStateName: 'updateCopyBlinkModalOpen',
      translation: 'copy',
      className: null,
      condition: isCopyBlinkModalOpen,
    },
    {
      state: isSaveBlinkModalOpen,
      setState: updateSaveBlinkModalOpen,
      stateName: 'isSaveBlinkModalOpen',
      setStateName: 'updateSaveBlinkModalOpen',
      translation: 'save',
      className: null,
      condition: isSaveBlinkModalOpen,
    },
    {
      state: isChargingKRWBlinkModalOpen,
      setState: setChargingKRWBlinkModalOpen,
      stateName: 'isChargingKRWBlinkModalOpen',
      setStateName: 'setChargingKRWBlinkModalOpen',
      translation: 'charging_KRW',
      className: 'charging',
      condition: isChargingKRWBlinkModalOpen,
    },
    {
      state: isChargingUSDBlinkModalOpen,
      setState: setChargingUSDBlinkModalOpen,
      stateName: 'isChargingUSDBlinkModalOpen',
      setStateName: 'setChargingUSDBlinkModalOpen',
      translation: 'charging_USD',
      className: 'charging',
      condition: isChargingUSDBlinkModalOpen,
    },
    {
      state: isDeleteInProgressBlinkModalOpen,
      setState: updateDeleteInProgressBlinkModalOpen,
      stateName: 'isDeleteInProgressBlinkModalOpen',
      setStateName: 'updateDeleteInProgressBlinkModalOpen',
      translation: 'delete-in-progress',
      className: null,
      condition: isDeleteInProgressBlinkModalOpen,
    },
    {
      state: isFilledInTheQuestion,
      setState: setFilledInTheQuestion,
      stateName: 'isFilledInTheQuestion',
      setStateName: 'setFilledInTheQuestion',
      translation: 'fill-in-on-question',
      className: 'fill-in-the-question',
      condition: isFilledInTheQuestion !== undefined && !isFilledInTheQuestion,
    },
    {
      state: isQuestionOverLimit,
      setState: setQuestionOverLimit,
      stateName: 'isQuestionOverLimit',
      setStateName: 'setQuestionOverLimit',
      translation: 'over-in-on-question',
      className: 'over-in-the-question',
      condition: isQuestionOverLimit,
    },
    {
      state: isMinimumAmountBlinkModalOpen,
      setState: updateMinimumAmountBlinkModalOpen,
      stateName: 'isMinimumAmountBlinkModalOpen',
      setStateName: 'updateMinimumAmountBlinkModalOpen',
      translation: 'minimum-amount-not-met',
      translationSub: 'refund',
      className: 'minimum-amount', // Explicitly mapped
      condition: isMinimumAmountBlinkModalOpen,
    },
    {
      state: isCustomReadingInsufficientBlinkModalOpen,
      setState: updateCustomReadingInsufficientBlinkModalOpen,
      stateName: 'isCustomReadingInsufficientBlinkModalOpen',
      setStateName: 'updateCustomReadingInsufficientBlinkModalOpen',
      translation: 'custom-reading-insufficient',
      className: null,
      condition: isCustomReadingInsufficientBlinkModalOpen,
    },
    {
      state: isUnavailableVoucher,
      setState: setUnavailableVoucher,
      stateName: 'isUnavailableVoucher',
      setStateName: 'setUnavailableVoucher',
      translation: 'unavailable-voucher',
      className: 'unavailable-voucher',
      condition: isUnavailableVoucher,
    },
    {
      state: isTarotModeUnavailable,
      setState: setTarotModeUnavailable,
      stateName: 'isTarotModeUnavailable',
      setStateName: 'setTarotModeUnavailable',
      translation: 'unavailable-which-tarot',
      className: 'unavailable-which-tarot',
      condition: isTarotModeUnavailable,
    },
    {
      state: isSpeedTarotNotificationOn,
      setState: setSpeedTarotNotificationOn,
      stateName: 'isSpeedTarotNotificationOn',
      setStateName: 'setSpeedTarotNotificationOn',
      translation: 'speed-tarot-notification',
      className: 'unavailable-which-tarot',
      condition:
        isSpeedTarotNotificationOn &&
        selectedTarotMode === 1 &&
        modalForm?.tarot,
    },
    {
      state: isSpeedTarotUnavailable,
      setState: setSpeedTarotUnavailable,
      stateName: 'isSpeedTarotUnavailable',
      setStateName: 'setSpeedTarotUnavailable',
      translation: 'speed-tarot-unavailable',
      className: 'unavailable-which-tarot',
      condition: isSpeedTarotUnavailable,
    },
    {
      state: selectedCardPosition,
      setState: setSelectedCardPosition,
      stateName: 'selectedCardPosition',
      setStateName: 'setSelectedCardPosition',
      translation: cardPositionInfo(
        selectedTarotMode, //! 마이페이지에선 1이 아니면 됨.
        selectedCardPosition,
        answerForm?.readingConfig,
        browserLanguage,
        t
      ),
      translationSub: 'card-position',
      className: 'which-spread',
      condition:
        (selectedCardPosition.isClicked &&
          selectedCardPosition.position !== -1 &&
          restOfState?.isAnswerModalOpen) ||
        (selectedCardPosition?.isClicked &&
          selectedCardPosition?.position !== -1 &&
          ((modalForm?.tarot && selectedTarotMode === 1) ||
            (!modalForm?.tarot &&
              answerForm?.isAnswered &&
              isReadyToShowDurumagi === true &&
              !(selectedTarotMode === 2 && !isVoucherModeOn)) ||
            (!modalForm?.tarot &&
              answerForm?.isAnswered &&
              selectedTarotMode === 2 &&
              !isVoucherModeOn))),
    },
    {
      state: selectedSpread,
      setState: setSelectedSpread,
      stateName: 'selectedSpread',
      setStateName: 'setSelectedSpread',
      state2: hasWatchedAdForBlinkModal,
      setState2: setWatchedAdForBlinkModal,
      stateName2: 'hasWatchedAdForBlinkModal',
      setStateName2: 'setWatchedAdForBlinkModal',
      translation: `${
        questionForm?.spreadTitle?.length > 0 //! 스피드 타로에서 안나오도록 하려면 여기에 selectedTarotMode !== 1 걸기1.
          ? questionForm?.spreadTitle
          : t(`blink_modal.none`)
      }`,
      translationSub: 'spread',
      className: 'which-spread',
      condition:
        modalForm?.tarot &&
        ((selectedSpread &&
          // selectedTarotMode !== 1 && //! 피드 타로에서 안나오도록 하려면 여기에 selectedTarotMode !== 1 걸기2
          questionForm?.spreadTitle?.length > 0 &&
          !(selectedTarotMode === 2 && !isVoucherModeOn)) ||
          (!isDoneAnimationOfBackground &&
            !isReadyToShowDurumagi &&
            hasWatchedAdForBlinkModal &&
            !hasWatchedAd &&
            !answerForm?.isAnswered &&
            !answerForm?.isWaiting &&
            questionForm?.spreadTitle?.length > 0 &&
            selectedTarotMode === 2 &&
            !isVoucherModeOn)),
    },
  ];

  // Render modal components based on the provided array
  return blinkModalInfoArr.map((modalInfo, index) => {
    const { state, setState, translation, className, condition, ...rest } =
      modalInfo;

    // Use centralized modalStyles, fallback to props styles if needed (though duplicated styles are being removed)
    const resolvedClassName = className
      ? modalStyles[className] || styles?.[className]
      : null;

    return condition ? (
      <BlinkModal
        key={`blink-modal-${index}`}
        className={resolvedClassName}
        state={state}
        setState={setState}
        stateName={rest?.stateName}
        setStateName={rest?.setStateName}
        {...(rest?.translationSub === 'spread' && {
          state2: rest?.state2,
          setState2: rest?.setState2,
          stateName2: rest?.stateName2,
          setStateName2: rest?.setStateName2,
        })}
        origin={'BlinkModalSet'}
      >
        {rest?.translationSub !== 'card-position' &&
        rest?.translationSub !== 'spread' &&
        rest?.translationSub !== 'refund'
          ? t(`blink_modal.${translation}`)
          : rest?.translationSub === 'refund'
          ? t(`refund.${translation}`)
          : translation}
      </BlinkModal>
    ) : null;
  });
};
