import React, { useEffect, useState } from 'react';
import { TarotManualButton } from './TarotManualButton';

const TarotManual = ({
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
  updateTarotManualModalOpen,
  isClickedForTodayCardFromHome = false,
  isTokenFromNavbar,
}) => {
  const [isClickedForTarotManual, setClickedForTarotManual] = useState(false);
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
        <TarotManualButton
          isToken={isTokenFromNavbar}
          isClickedForTarotManual={isClickedForTarotManual}
          setClickedForTarotManual={setClickedForTarotManual}
          updateTarotManualModalOpen={updateTarotManualModalOpen}
        />
      )}
    </>
  );
};

export default TarotManual;
