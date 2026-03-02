import React, { useEffect, useState } from 'react';
import { LoginButton } from './LoginButton';

const Login = ({ userInfo, isTokenFromNavbar, stateGroup, setStateGroup }) => {
  const [isClickedForLogin, setClickedForLogin] = useState(false);
  const [isConditionMet, setConditionMet] = useState(false);
  const [after2000ms, setAfter2000ms] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      setAfter2000ms(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [userInfo?.email]);

  useEffect(() => {
    // Navbar의 로그인 감지 기능(useAuth) 사용
    if (!isTokenFromNavbar) {
      setConditionMet(
        userInfo?.email === '' ||
          userInfo?.email === null ||
          userInfo?.email === undefined
      );
      return;
    }
    setConditionMet(
      !(
        userInfo?.email !== '' &&
        userInfo?.email !== null &&
        userInfo?.email !== undefined
      )
    );
  }, [userInfo?.email, isTokenFromNavbar]);

  return (
    <>
      {isConditionMet && after2000ms && (
        <LoginButton
          isToken={isTokenFromNavbar}
          isClickedForLogin={isClickedForLogin}
          setClickedForLogin={setClickedForLogin}
        />
      )}
    </>
  );
};

export default Login;
