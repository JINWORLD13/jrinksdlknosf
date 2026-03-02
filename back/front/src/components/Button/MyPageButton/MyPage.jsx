import React, { useEffect, useState } from 'react';
import { MyPageButton } from './MyPageButton';

const MyPage = ({
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
}) => {
  const [isClickedForMyPage, setClickedForMyPage] = useState(false);
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
        <MyPageButton
          isToken={isTokenFromNavbar}
          isClickedForMyPage={isClickedForMyPage}
          setClickedForMyPage={setClickedForMyPage}
          setStateGroup={setStateGroup}
        />
      )}
    </>
  );
};

export default MyPage;
