import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLanguageChange } from '@/hooks';
import { getPathWithLang } from '@/config/route/UrlPaths';
import { isDevelopmentMode } from '@/utils/constants';
import styles from './MyPageButton.module.scss';

export const MyPageButton = ({
  isToken,
  isClickedForMyPage,
  setClickedForMyPage,
  setStateGroup,
  ...props
}) => {
  const browserLanguage = useLanguageChange();
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );
  const navigate = useNavigate();

  const handleClick = async e => {
    try {
      if (isClickedForMyPage) return;
      setClickedForMyPage(true);
      navigate(getPathWithLang(browserLanguage).P13);
    } catch (err) {
      if (isDevelopmentMode) {
        console.log(err);
      }
    } finally {
      setClickedForMyPage(false);
    }
  };

  const loginButton = useRef(null);

  return (
    <div
      className={styles['mypage']}
      onClick={handleClick} // React의 onClick 이벤트 핸들러는 비동기 처리를 기다리지 않아도 되도록 설계되어 있어요. React는 이벤트가 발생하면 함수를 바로 실행하고, 그 안에서 비동기 작업(await)이 완료되길 기다리지 않아도 괜찮아요. 그래서 onClick={handleClick}처럼 바로 함수를 연결해도 문제가 없는 거예요.
      ref={loginButton}
    >
    </div>
  );
};
