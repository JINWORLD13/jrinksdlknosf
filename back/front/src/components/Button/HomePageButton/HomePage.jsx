import React, { useEffect, useState } from 'react';
import { HomePageButton } from './HomePageButton';

const HomePage = ({
  answerForm,
  userInfo,
  isAnswerModalOpen,
  isTokenFromNavbar,
}) => {
  const [isClickedForHomePage, setClickedForHomePage] = useState(false);
  const [isConditionMet, setConditionMet] = useState(false);

  useEffect(() => {
    // Navbar의 로그인 감지 기능(useAuth) 사용
    if (!isTokenFromNavbar) {
      setConditionMet(false);
      return;
    }
    setConditionMet(userInfo?.email !== '' && userInfo?.email !== undefined);
  }, [userInfo?.email, isTokenFromNavbar]);

  return (
    <>
      {isConditionMet && !isAnswerModalOpen && (
        <HomePageButton
          isToken={isTokenFromNavbar}
          isClickedForHomePage={isClickedForHomePage}
          setClickedForHomePage={setClickedForHomePage}
        />
      )}
    </>
  );
};

export default HomePage;
