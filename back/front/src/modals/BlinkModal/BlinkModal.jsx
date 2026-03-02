import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/common/Card.jsx';
import styles from './BlinkModal.module.scss';
import { useLanguageChange } from '@/hooks';

const BlinkModal = ({ ...props }) => {
  const browserLanguage = useLanguageChange();

  const closeModal = () => {
    //! 최종 BlinkModalSet으로부터 온 건 따로 관리
    if (props?.origin === 'BlinkModalSet') {
      if (props?.setStateName === 'setSelectedCardPosition') {
        props?.setState(prev => {
          return { isClicked: false, position: -1 };
        });
      } else if (props?.setStateName === 'setFilledInTheQuestion') {
        props?.setState(true);
      } else {
        props?.setState(false);
      }
    } else {
      //~ 최종 BlinkModal로부터 온 것
      if (
        props?.updateLoginBlinkModalOpen !== undefined &&
        props?.updateLoginBlinkModalOpen !== null
      ) {
        props?.updateLoginBlinkModalOpen(false);
      } else if (
        props?.updateCopyBlinkModalOpen !== undefined &&
        props?.updateCopyBlinkModalOpen !== null
      ) {
        props?.updateCopyBlinkModalOpen(false);
      } else if (
        props?.updateSaveBlinkModalOpen !== undefined &&
        props?.updateSaveBlinkModalOpen !== null
      ) {
        props?.updateSaveBlinkModalOpen(false);
      } else if (
        props?.setChargingKRWBlinkModalOpen !== undefined &&
        props?.setChargingKRWBlinkModalOpen !== null
      ) {
        props?.setChargingKRWBlinkModalOpen(false);
      } else if (
        props?.setChargingUSDBlinkModalOpen !== undefined &&
        props?.setChargingUSDBlinkModalOpen !== null
      ) {
        props?.setChargingUSDBlinkModalOpen(false);
      } else if (
        props?.setFilledInTheQuestion !== undefined &&
        props?.setFilledInTheQuestion !== null
      ) {
        props?.setState(true);
        props?.setFilledInTheQuestion(true);
      } else if (
        props?.setQuestionOverLimit !== undefined &&
        props?.setQuestionOverLimit !== null
      ) {
        props?.setQuestionOverLimit(false);
      } else if (
        props?.setUnavailableVoucher !== undefined &&
        props?.setUnavailableVoucher !== null
      ) {
        props?.setUnavailableVoucher(false);
      } else if (
        props?.setTarotModeUnavailable !== undefined &&
        props?.setTarotModeUnavailable !== null
      ) {
        props?.setTarotModeUnavailable(false);
      } else if (
        props?.setSelectedSpread !== undefined &&
        props?.setSelectedSpread !== null
      ) {
        props?.setSelectedSpread(false);
      } else if (
        props?.setSelectedCardPosition !== undefined &&
        props?.setSelectedCardPosition !== null
      ) {
        props?.setSelectedCardPosition(prev => {
          return { isClicked: false, position: -1 };
        });
      } else if (
        props?.setWatchedAdForBlinkModal !== undefined &&
        props?.setWatchedAdForBlinkModal !== null
      ) {
        props?.setWatchedAdForBlinkModal(false);
      } else if (
        props?.setSpeedTarotNotificationOn !== undefined &&
        props?.setSpeedTarotNotificationOn !== null
      ) {
        props?.setSpeedTarotNotificationOn(false);
      } else if (
        props?.updateMinimumAmountBlinkModalOpen !== undefined &&
        props?.updateMinimumAmountBlinkModalOpen !== null
      ) {
        props?.updateMinimumAmountBlinkModalOpen(false);
      }
    }
  };

  const loginMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isLoginBlinkModalOpen || null
      : props?.state || null;
  const copyMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isCopyBlinkModalOpen || null
      : props?.state || null;
  const saveMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isSaveBlinkModalOpen || null
      : props?.state || null;
  const chargeKRWMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isChargingKRWBlinkModalOpen || null
      : props?.state || null;
  const chargeUSDMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isChargingUSDBlinkModalOpen || null
      : props?.state || null;
  const fillInQuestionMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isFilledInTheQuestion || null
      : props?.setStateName === 'setFilledInTheQuestion'
      ? props?.state !== undefined && props?.state === false
        ? true
        : null
      : props?.state || null;
  const overInQuestionMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isQuestionOverLimit || null
      : props?.state || null;
  const unavailableVoucherMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isUnavailableVoucher || null
      : props?.state || null;
  const unavailableSelectedTarotModeMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isTarotModeUnavailable || null
      : props?.state || null;
  const selectedSpreadMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.selectedSpread || null
      : props?.state || null;
  const selectedCardPositionMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.selectedCardPosition?.position || null
      : props?.state?.position || null;
  const speedTarotNotificationOn =
    props?.origin !== 'BlinkModalSet'
      ? props?.isSpeedTarotNotificationOn || null
      : props?.state || null;
  const adWatchedOnlyForBlinkModalMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.hasWatchedAdForBlinkModal || null
      : props?.state2 || null;
  const minimumAmountMsg =
    props?.origin !== 'BlinkModalSet'
      ? props?.isMinimumAmountBlinkModalOpen || null
      : props?.state || null;

  //! 일단 성능에 크게 영향주지 않음...
  useEffect(() => {
    if (
      ((props?.origin !== 'BlinkModalSet' &&
        props?.selectedCardPosition?.isClicked) ||
        (props?.origin === 'BlinkModalSet' && props?.state?.isClicked)) &&
      selectedCardPositionMsg !== -1
    ) {
      const closeModalTimeoutForCardPosition = setTimeout(() => {
        if (
          props?.origin !== 'BlinkModalSet' &&
          props?.setSelectedCardPosition !== undefined &&
          props?.setSelectedCardPosition !== null
        ) {
          props?.setSelectedCardPosition(prev => {
            return { isClicked: false, position: -1 };
          });
        }
        if (
          props?.origin === 'BlinkModalSet' &&
          props?.setStateName === 'setSelectedCardPosition'
        ) {
          props?.setStateName(prev => {
            return { isClicked: false, position: -1 };
          });
        }
      }, 1000);
      return () => {
        clearTimeout(closeModalTimeoutForCardPosition);
      };
    }
    if (
      (props?.origin !== 'BlinkModalSet' &&
        props?.isSpeedTarotNotificationOn) ||
      (props?.origin === 'BlinkModalSet' &&
        props?.state &&
        props?.stateName === 'isSpeedTarotNotificationOn')
    ) {
      const closeModalTimeoutForSpeedTarotNotification = setTimeout(() => {
        if (
          props?.origin !== 'BlinkModalSet' &&
          props?.setSpeedTarotNotificationOn !== undefined &&
          props?.setSpeedTarotNotificationOn !== null
        ) {
          props?.setSpeedTarotNotificationOn(prev => {
            return false``;
          });
        }
        if (
          props?.origin === 'BlinkModalSet' &&
          props?.setStateName === 'setSpeedTarotNotificationOn'
        ) {
          props?.setStateName(prev => {
            return false;
          });
        }
      }, 1500);
      return () => {
        clearTimeout(closeModalTimeoutForSpeedTarotNotification);
      };
    }
    if (
      (props?.origin !== 'BlinkModalSet' && props?.isQuestionOverLimit) ||
      (props?.origin === 'BlinkModalSet' &&
        props?.state &&
        props?.stateName === 'isQuestionOverLimit')
    ) {
      const closeModalTimeoutForOverInTheQuestion = setTimeout(() => {
        if (
          props?.origin !== 'BlinkModalSet' &&
          props?.setQuestionOverLimit !== undefined &&
          props?.setQuestionOverLimit !== null
        ) {
          props?.setQuestionOverLimit(prev => {
            return false;
          });
        }
        if (
          props?.origin === 'BlinkModalSet' &&
          props?.setStateName === 'setQuestionOverLimit'
        ) {
          props?.setStateName(prev => {
            return false;
          });
        }
      }, 1000);
      return () => {
        clearTimeout(closeModalTimeoutForOverInTheQuestion);
      };
    }
  });

  useEffect(() => {
    // 모달이 실제로 표시될 때만 타임아웃 설정
    const isModalVisible =
      loginMsg ||
      copyMsg ||
      saveMsg ||
      chargeKRWMsg ||
      chargeUSDMsg ||
      fillInQuestionMsg ||
      overInQuestionMsg ||
      unavailableVoucherMsg ||
      unavailableSelectedTarotModeMsg ||
      selectedSpreadMsg ||
      selectedCardPositionMsg ||
      adWatchedOnlyForBlinkModalMsg ||
      speedTarotNotificationOn ||
      minimumAmountMsg;

    if (!isModalVisible) return;

    const time =
      props?.setStateName === 'setSpeedTarotNotificationOn' ||
      props?.setSpeedTarotNotificationOn
        ? 1500
        : 1000;
    const closeModalTimeout = setTimeout(() => {
      closeModal();
    }, time);

    let closeModalTimeout2;
    if (
      props?.origin !== 'BlinkModalSet' &&
      props?.hasWatchedAdForBlinkModal === true &&
      props?.className
    ) {
      closeModalTimeout2 = setTimeout(() => {
        props?.setWatchedAdForBlinkModal(false);
      }, 1500);
    } else if (
      props?.origin === 'BlinkModalSet' &&
      props?.stateName2 === 'hasWatchedAdForBlinkModal' &&
      props?.state2 === true &&
      props?.className
    ) {
      closeModalTimeout2 = setTimeout(() => {
        props?.setState2(false);
      }, 1500);
    }

    return () => {
      clearTimeout(closeModalTimeout);
      if (closeModalTimeout2) clearTimeout(closeModalTimeout2);
    };
  }, [
    loginMsg,
    copyMsg,
    saveMsg,
    chargeKRWMsg,
    chargeUSDMsg,
    fillInQuestionMsg,
    overInQuestionMsg,
    unavailableVoucherMsg,
    unavailableSelectedTarotModeMsg,
    selectedSpreadMsg,
    selectedCardPositionMsg,
    adWatchedOnlyForBlinkModalMsg,
    speedTarotNotificationOn,
    minimumAmountMsg,
  ]);

  // 일본어에서 숫자+통화 부분을 크게 표시하는 함수
  const formatTextForJapanese = text => {
    if (typeof text !== 'string' || browserLanguage !== 'ja') return text;

    // 일본어: USD는 potta 1.25rem, KRW/ウォン는 2.2rem
    const parts = text.split(/([\d,]+(?:USD|KRW|ウォン))/g);

    return parts.map((part, index) => {
      if (part && /[\d,]+USD/.test(part)) {
        return (
          <span
            key={index}
            style={{ fontFamily: 'Potta One, cursive', fontSize: '1.25rem' }}
          >
            {part}
          </span>
        );
      } else if (part && /[\d,]+(?:KRW|ウォン)/.test(part)) {
        return (
          <span key={index} style={{ fontSize: '2.2rem' }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const isVisible =
    loginMsg ||
    copyMsg ||
    saveMsg ||
    chargeKRWMsg ||
    chargeUSDMsg ||
    fillInQuestionMsg ||
    overInQuestionMsg ||
    unavailableVoucherMsg ||
    unavailableSelectedTarotModeMsg ||
    selectedSpreadMsg ||
    selectedCardPositionMsg ||
    adWatchedOnlyForBlinkModalMsg ||
    speedTarotNotificationOn ||
    minimumAmountMsg;

  if (!isVisible) return null;

  const node = (
    <Card
      className={`${
        browserLanguage === 'ja'
          ? styles['blink-modal-japanese']
          : styles['blink-modal']
      } ${props?.className ?? ''} ${
        props?.stateName === 'isSpeedTarotNotificationOn' &&
        (browserLanguage === 'ja'
          ? styles['speedTarotNotification-japanese']
          : styles['speedTarotNotification'])
      }`}
    >
      <div>{formatTextForJapanese(props?.children)}</div>
    </Card>
  );

  // Answer/Durumagi 모달 등과 stacking context가 갈려도 항상 보이도록 body 포탈로 렌더링
  if (typeof document !== 'undefined' && document?.body) {
    return createPortal(node, document.body);
  }
  return node;
};

export default BlinkModal;
