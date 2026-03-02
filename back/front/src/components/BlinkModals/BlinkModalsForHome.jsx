import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './';
import { cardPositionInfo } from '../../lib/tarot/card/cardPositionInfo';
import Card from '../../components/common/Card.jsx';
import stylesBlink from './';

//! 몇몇 모달 안사라짐.
const BlinkModalsForHome = ({
  isLoginBlinkModalOpen,
  updateLoginBlinkModalOpen,
  isCopyBlinkModalOpen,
  updateCopyBlinkModalOpen,
  isSaveBlinkModalOpen,
  updateSaveBlinkModalOpen,
  isChargingKRWBlinkModalOpen,
  setChargingKRWBlinkModalOpen,
  isChargingUSDBlinkModalOpen,
  setChargingUSDBlinkModalOpen,
  isFilledInTheQuestion,
  setFilledInTheQuestion,
  isUnavailableVoucher,
  setUnavailableVoucher,
  isTarotModeUnavailable,
  setTarotModeUnavailable,
  selectedCardPosition,
  setSelectedCardPosition,
  selectedSpread,
  setSelectedSpread,
  selectedTarotMode,
  questionForm,
  isVoucherModeOn,
  hasWatchedAd,
  browserLanguage,
}) => {
  const { t } = useTranslation();

  const modalConfigs = [
    {
      isOpen: isLoginBlinkModalOpen,
      updateOpen: updateLoginBlinkModalOpen,
      content: t(`blink_modal.login`),
    },
    {
      isOpen: isCopyBlinkModalOpen,
      updateOpen: updateCopyBlinkModalOpen,
      content: t(`blink_modal.copy`),
    },
    {
      isOpen: isSaveBlinkModalOpen,
      updateOpen: updateSaveBlinkModalOpen,
      content: t(`blink_modal.save`),
    },
    {
      isOpen: isChargingKRWBlinkModalOpen,
      updateOpen: setChargingKRWBlinkModalOpen,
      content: t(`blink_modal.charging_KRW`),
      className: styles['charging'],
    },
    {
      isOpen: isChargingUSDBlinkModalOpen,
      updateOpen: setChargingUSDBlinkModalOpen,
      content: t(`blink_modal.charging_USD`),
      className: styles['charging'],
    },
    {
      isOpen: !isFilledInTheQuestion,
      updateOpen: value => setFilledInTheQuestion(!value),
      content: t(`blink_modal.fill-in-on-question`),
      className: styles['fill-in-the-question'],
    },
    {
      isOpen: isUnavailableVoucher,
      updateOpen: setUnavailableVoucher,
      content: t(`blink_modal.unavailable-voucher`),
      className: styles['unavailable-voucher'],
    },
    {
      isOpen: isTarotModeUnavailable,
      updateOpen: setTarotModeUnavailable,
      content: t(`blink_modal.unavailable-which-tarot`),
      className: styles['unavailable-which-tarot'],
    },
    {
      isOpen: selectedCardPosition.isClicked,
      updateOpen: setSelectedCardPosition,
      content: cardPositionInfo(
        selectedTarotMode,
        selectedCardPosition,
        browserLanguage,
        t
      ),
      className: styles['which-spread'],
    },
    {
      isOpen:
        (selectedSpread &&
          selectedTarotMode !== 1 &&
          questionForm?.spreadTitle?.length > 0 &&
          !(selectedTarotMode === 2 && !isVoucherModeOn)) ||
        hasWatchedAd,
      updateOpen: setSelectedSpread,
      content:
        t(`blink_modal.spread`) +
        `${
          questionForm?.spreadTitle?.length > 0 && selectedTarotMode !== 1
            ? questionForm?.spreadTitle
            : t(`blink_modal.none`)
        }`,
      className: styles['which-spread'],
    },
  ];

  return (
    <>
      {modalConfigs.map(
        (config, index) =>
          config.isOpen && (
            <BlinkModal key={index} {...config}>
              {config.content}
            </BlinkModal>
          )
      )}
    </>
  );
};

const BlinkModal = ({ isOpen, updateOpen, className, children }) => {
  const closeModal = () => {
    if (typeof updateOpen === 'function') {
      updateOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const closeModalTimeout = setTimeout(() => {
        closeModal();
      }, 1500);

      return () => {
        clearTimeout(closeModalTimeout);
      };
    }
  }, [isOpen, updateOpen]);

  return (
    <>
      {isOpen && (
        <Card className={`${stylesBlink['blink-modal']} ${className || ''}`}>
          <div>{children}</div>
        </Card>
      )}
    </>
  );
};

export default BlinkModalsForHome;

