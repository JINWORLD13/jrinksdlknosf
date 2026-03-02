import { useState } from 'react';

// Default state moved outside the component for better performance
const defaultState = {
  shuffle: 0,
  isReadyToShuffle: false,
  isShuffleFinished: false, // Fixed typo in isShuffleFinished
  spread: false,
  flippedIndex: [],
  selectedCardIndexList: [],
};

/**
 * Custom hook for managing card state in a card-based interface
 * @param {Object} inputState - Initial state to override default values
 * @returns {[Object, Function]} - Current state and state update function
 */
const useCardFormState = (inputState = null) => {
  // Initialize state with proper validation and merging
  const getInitialState = () => {
    if (!inputState || typeof inputState !== 'object') {
      return defaultState;
    }
    return {
      ...defaultState,
      ...inputState
    };
  };

  const [cardForm, setCardForm] = useState(getInitialState());

  // Enhanced update function that supports both direct and functional updates
  const updateCardForm = (newState) => {
    if (typeof newState === 'function') {
      setCardForm(prevState => ({
        ...defaultState,
        ...prevState,
        ...newState(prevState)
      }));
    } else {
      setCardForm(prevState => ({
        ...defaultState,
        ...prevState,
        ...newState
      }));
    }
  };

  return [cardForm, updateCardForm];
};

export default useCardFormState;
