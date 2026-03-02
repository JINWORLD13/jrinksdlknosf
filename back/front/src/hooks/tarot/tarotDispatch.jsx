import { useDispatch, useSelector } from 'react-redux';
import {
  resetAllTarotCards,
  setTotalCardsNumber,
} from '../../store/tarotCardStore.jsx';

// 선택한 스프레드 카드 수 갱신 (hook으로 수정)
export const useSetTotalCardsNumber = () => {
  const dispatch = useDispatch();
  return count => {
    dispatch(setTotalCardsNumber(count));
  };
};

// 타로 카드 덱 가져오기
export const useTarotCardDeck = () =>
  useSelector(state => state.tarotCard.tarotCardDeck);

// 전체 카드 수 가져오기
export const useTotalCardsNumber = () =>
  useSelector(state => state.tarotCard.totalCardsNumber);

// 선택된 타로 카드 가져오기
export const useSelectedTarotCards = () =>
  useSelector(state => state.tarotCard.selectedTarotCards);

export const useResetTarotCards = () => {
  const dispatch = useDispatch();
  dispatch(resetAllTarotCards());
};

//   resetAllTarotCards,
//   resetAllTarotCardsWithoutReverse,
//   shuffleTarotCardDeckWithoutReverse,
//   shuffleTarotCardDeck,
//   drawCard,
//   setTotalCardsNumber,
// } from '../../store/tarotCardStore.jsx';

// //! const dispatch(useState도 마찬가지)는 함수내, 이벤트핸들러 내(onClick 같은 거)에는 절대 선언 하지 말기.

// // & 선택한 스프레드 카드 수 갱신
