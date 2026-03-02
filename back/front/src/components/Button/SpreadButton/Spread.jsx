import React, { useEffect, useState } from 'react';
import { SpreadButton } from './SpreadButton';

const Spread = ({
  modalForm,
  answerForm,
  isReadyToShowDurumagi,
  userInfo,
  cardForm,
  todayCardIndexInLocalStorage,
  styles,
  handleStateGroup,
  updateCardForm,
  stateGroup,
  setStateGroup,
  isClickedForTodayCardFromHome = false,
  isTokenFromNavbar,
  onSpreadClick,
}) => {
  const [isClickedForSpread, setClickedForSpread] = useState(false);
  const [isConditionMet, setConditionMet] = useState(false);

  useEffect(() => {
    // Navbar의 로그인 감지 기능(useAuth) 사용
    if (!isTokenFromNavbar) {
      setConditionMet(false);
      return;
    }
    setConditionMet(
      !modalForm?.spread &&
        !modalForm?.tarot &&
        !answerForm?.isWaiting &&
        !answerForm?.isAnswered &&
        !isReadyToShowDurumagi &&
        userInfo?.email !== '' &&
        userInfo?.email !== undefined
    );
  }, [
    userInfo?.email,
    modalForm?.spread,
    modalForm?.tarot,
    answerForm?.isWaiting,
    answerForm?.isAnswered,
    isReadyToShowDurumagi,
    isTokenFromNavbar,
  ]);

  return (
    <>
      {isConditionMet && !isClickedForTodayCardFromHome && (
        <SpreadButton
          isToken={isTokenFromNavbar}
          isClickedForSpread={isClickedForSpread}
          setClickedForSpread={setClickedForSpread}
          setStateGroup={setStateGroup}
          onSpreadClick={onSpreadClick}
        />
      )}
    </>
  );
};

export default Spread;
