import React, { useState, useEffect } from 'react';
import styles from './TarotCardDeckForm.module.scss';
import TarotCardShuffleForm from './TarotCardDeckShuffleForm.jsx';
import { backImagePath } from '../../data/images/images.jsx';
import { useSelectedTarotCards, useTarotCardDeck } from '@/hooks';
import { useDispatch } from 'react-redux';
import { shuffleTarotCardDeck } from '../../store/tarotCardStore.jsx';

const TarotCardDeckForm = props => {
  const dispatch = useDispatch();
  const [isClickable, setIsClickable] = useState(true);
  const [isDeckClicked, setIsDeckClicked] = useState(false);
  const tarotCardDeck = useTarotCardDeck();
  const selectedTarotCards = useSelectedTarotCards();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
  } = props.stateGroup;

  const {
    updateAnswerForm,
    updateCardForm,
    updateQuestionForm,
    updateModalForm,
    setSelectedTarotMode,
    setIsCSSInvisible,
    updateCountry,
    setSelectedCardPosition,
    ...rest
  } = props.setStateGroup;

  const { toggleSpreadModal, toggleTarotModal } = props.toggleModalGroup;
  const {
    handleAnsweredState,
    handleCardForm,
    handleQuestionForm,
    handleResetAll,
    handleResetDeck,
    handleSpreadValue,
    handleSuffleFinishValue,
    handleSelectedTarotMode,
    ...rest3
  } = props.handleStateGroup;

  const handleShuffleDeck = () => {
    dispatch(shuffleTarotCardDeck);
    updateCardForm({ ...cardForm, shuffle: cardForm?.shuffle + 1 });
  };

  const [timeoutId, setTimeoutId] = useState(null);

  const handleDeckClick = () => {
    if (isClickable) {
      setIsClickable(false);
      setIsDeckClicked(true);
      const id = setTimeout(() => {
        setIsClickable(true);
        setIsDeckClicked(false);
      }, 300);
      setTimeoutId(id);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <>
      <div
        className={`${styles.deck}`}
        onClick={() => {
          if (answerForm?.isSubmitted === true || selectedTarotMode === 1) {
            handleShuffleDeck();
            handleDeckClick();
          }
        }}
        onDragEnd={() => {
          if (answerForm?.isSubmitted === true || selectedTarotMode === 1) {
            handleSpreadValue(true);
            handleSuffleFinishValue(true);
            setIsCSSInvisible(true);
          }
        }}
      >
        {isDeckClicked === true && selectedTarotCards?.length === 0 ? (
          <TarotCardShuffleForm />
        ) : (
          tarotCardDeck.slice(0, 40).map((elem, i) => {
            return (
              <div
                className={`${styles.card}`}
                draggable={
                  answerForm?.isSubmitted === false &&
                  (selectedTarotMode === 2 ||
                    selectedTarotMode === 3 ||
                    selectedTarotMode === 4)
                    ? false
                    : true
                }
              >
                <img src={backImagePath} alt="back" draggable={false} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default TarotCardDeckForm;
