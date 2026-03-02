import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTotalCardsNumber } from '@/hooks';
import { useLanguageChange } from '@/hooks';
import Button from '../../../components/common/Button';
import CancelButton from '../../../components/common/CancelButton';
import { resetAllTarotCards } from '../../../store/tarotCardStore';
import { useDispatch } from 'react-redux';

export const SpeedTarotBtnBox = ({
  styles,
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  ...props
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    selectedAdType,
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
    handleReadyToShuffleValue,
    handleSuffleFinishValue,
    handleSelectedTarotMode,
    ...rest3
  } = handleStateGroup;
  const totalCardsNumber = useTotalCardsNumber();
  const browswerLanguage = useLanguageChange();

  return (
    <div className={styles['btn-box']}>
      <Button
        className={`${
          isCSSInvisible === true && selectedTarotMode === 1
            ? styles['invisible']
            : browswerLanguage === 'ja'
            ? styles['btn-japanese']
            : styles['btn']
        } `}
        onClick={() => {
          handleSuffleFinishValue(true);
          handleSpreadValue(true);
          setIsCSSInvisible(true);
          setSelectedCardPosition(prev => {
            return {
              isClicked: false,
              position: -1,
            };
          });
        }}
        autoFocus={true}
      >
        {t(`button.select`)}
      </Button>
      <CancelButton
        className={`${
          isCSSInvisible === true && selectedTarotMode === 1
            ? styles['invisible']
            : `${
                browswerLanguage === 'ja'
                  ? styles['btn-japanese']
                  : styles['btn']
              }`
        } `}
        onClick={(e = null) => {
          if (selectedTarotMode === 1) {
            toggleTarotModal(
              false,
              questionForm?.spreadListNumber,
              questionForm?.spreadTitle,
              totalCardsNumber
            );
            setWatchedAd(false); //! 전면 광고를 위해
          } else {
            toggleTarotModal(
              true,
              questionForm?.spreadListNumber,
              questionForm?.spreadTitle,
              totalCardsNumber
            );
            updateCardForm({
              ...cardForm,
              spread: false,
              isShuffleFinished: false,
              selectedCardIndexList: [],
            });
            dispatch(resetAllTarotCards());
          }
          setIsCSSInvisible(false);
          handleReadyToShuffleValue(false);
          updateAnswerForm(prev => {
            return { ...prev, isSubmitted: false };
          });
        }}
      >
        {t(`button.cancel`)}
      </CancelButton>
    </div>
  );
};
