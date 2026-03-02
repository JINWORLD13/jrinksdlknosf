import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResetTarotCards, useTotalCardsNumber } from '@/hooks';
import { useLanguageChange } from '@/hooks';
import TarotCardSpreadForm from '../../../components/TarotCardForm/TarotCardSpreadForm';
import Button from '../../../components/common/Button';
import CancelButton from '../../../components/common/CancelButton';
import { BtnBox } from './BtnBox';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();
import { isAdsFreePassValid } from '../../../lib/user/isAdsFreePassValid';
import AdLoadingComponent from '../../../components/GoogleAd/components/AdLoadingComponent';

export const TarotDisplacementForm = ({
  styles,
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  userInfo,
  ...props
}) => {
  const { t } = useTranslation();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    selectedCardPosition,
    selectedAdType,
    hasWatchedAd,
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
    setSelectedCardPosition,
    setSelectedAdType,
    setWatchedAd,
    ...rest2
  } = setStateGroup;

  const { toggleSpreadModal, toggleTarotModal } = toggleModalGroup;
  const {
    handleAnsweredState,
    handleCardForm,
    handleQuestionForm,
    handleResetAll,
    handleResetDeck,
    handleSpreadValue,
    handleSelectedTarotMode,
    ...rest3
  } = handleStateGroup;
  const totalCardsNumber = useTotalCardsNumber();
  const browswerLanguage = useLanguageChange();

  //! 전면 광고를 위해
  useEffect(() => {
    if (selectedTarotMode === 1 && isNative && !isAdsFreePassValid(userInfo)) {
      setSelectedAdType(1);
      setWatchedAd(false);
    }
  }, []);

  if (
    isNative &&
    selectedTarotMode === 1 &&
    (!hasWatchedAd || (selectedAdType !== 0 && hasWatchedAd)) &&
    !isAdsFreePassValid(userInfo)
  )
    return (
      <AdLoadingComponent
        setSelectedAdType={setSelectedAdType}
        setWatchedAd={setWatchedAd}
        // updateModalForm={updateModalForm} //! 다른 상태값 고려해야 해서 주석
      />
    );
  return (
    <>
      <div className={styles['displacement-box']}>
        <div className={styles['flex-grow']}></div>
        <div
          className={`${styles['displacement']} ${
            questionForm?.spreadListNumber === 501
              ? styles['width-for-five-cards-relationship-spread']
              : ''
          }`}
        >
          <TarotCardSpreadForm
            cardForm={cardForm}
            updateCardForm={updateCardForm}
            questionForm={questionForm}
            selectedCardPosition={selectedCardPosition}
            setSelectedCardPosition={setSelectedCardPosition}
          />
        </div>
        <div className={styles['flex-grow']}></div>
        <BtnBox styles={styles}>
          <CancelButton
            className={`${
              browswerLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
            }`}
            onClick={(e = null) => {
              if (
                isNative &&
                selectedTarotMode === 1 &&
                (!hasWatchedAd || (selectedAdType !== 0 && hasWatchedAd)) &&
                !isAdsFreePassValid(userInfo)
              )
                return;
              handleResetDeck();
              handleSpreadValue(false);
              setIsCSSInvisible(false);
              updateAnswerForm(prev => {
                return {
                  ...prev,
                  isWaiting: false,
                  isAnswered: false,
                  isSubmitted: false,
                };
              });
              toggleTarotModal(
                true,
                questionForm?.spreadListNumber,
                questionForm?.spreadTitle,
                totalCardsNumber
              );
              setSelectedCardPosition(prev => {
                return {
                  isClicked: false,
                  position: -1,
                };
              });
              if (isNative && selectedTarotMode === 1) {
                setSelectedAdType(0);
                setWatchedAd(false);
              }
            }}
          >
            {t(`button.cancel`)}
          </CancelButton>
        </BtnBox>
      </div>
    </>
  );
};
