import React from 'react';
import { useTotalCardsNumber } from '@/hooks';
import { useEffect, useState } from 'react';
import { TarotModalCard } from './TarotModalCard';
import TarotCardChoiceForm from '../../../components/TarotCardForm/TarotCardChoiceForm';
import TarotCardDeckForm from '../../../components/TarotCardForm/TarotCardDeckForm';
import { GuidanceBox } from './GuidanceBox';
import { SpeedTarotBtnBox } from './SpeedTarotBtnBox';
import { TarotDisplacementForm } from './TarotDisplacementForm';

export const SpeedTarot = ({
  styles,
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  userInfo,
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
    selectedCardPosition,
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

  const [isLandscape, setIsLandscape] = useState(
    window.screen.width > window.screen.height
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.screen.width > window.screen.height);
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);
  return (
    <>
      <TarotModalCard styles={styles}>
        {cardForm?.spread === true ? (
          <>
            {cardForm?.selectedCardIndexList.length !== totalCardsNumber ? (
              <>
                <div className={styles['flex-grow3']}></div>
                <div className={styles['choice-form']}>
                  <TarotCardChoiceForm
                    stateGroup={stateGroup}
                    setStateGroup={setStateGroup}
                    toggleModalGroup={toggleModalGroup}
                    handleStateGroup={handleStateGroup}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles['flex-grow3']}></div>
                <div className={styles['displacement-form']}>
                  <TarotDisplacementForm
                    styles={styles}
                    stateGroup={stateGroup}
                    setStateGroup={setStateGroup}
                    toggleModalGroup={toggleModalGroup}
                    handleStateGroup={handleStateGroup}
                    userInfo={userInfo}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles['flex-grow2']}></div>
            <div className={styles['deck-form']}>
              <TarotCardDeckForm
                stateGroup={stateGroup}
                setStateGroup={setStateGroup}
                toggleModalGroup={toggleModalGroup}
                handleStateGroup={handleStateGroup}
              />
            </div>
            <div className={styles['flex-grow']}></div>
            {/* {!isLandscape && window.screen.height > 250 && (
              <GuidanceBox styles={styles} isCSSInvisible={isCSSInvisible} selectedTarotMode={selectedTarotMode}/>
            )}
            {isLandscape && window.screen.height > 350 && (
              <GuidanceBox styles={styles} isCSSInvisible={isCSSInvisible} selectedTarotMode={selectedTarotMode}/>
            )} */}
            <GuidanceBox
              styles={styles}
              isCSSInvisible={isCSSInvisible}
              selectedTarotMode={selectedTarotMode}
            />
            <div className={styles['flex-grow']}></div>
            <SpeedTarotBtnBox
              styles={styles}
              stateGroup={stateGroup}
              setStateGroup={setStateGroup}
              toggleModalGroup={toggleModalGroup}
              handleStateGroup={handleStateGroup}
            />
          </>
        )}
      </TarotModalCard>
    </>
  );
};
