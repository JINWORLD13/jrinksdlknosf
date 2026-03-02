import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();
import { useSelector } from 'react-redux';
import { isDevelopmentMode } from '@/utils/constants';
import styles from './SpreadButton.module.scss';

export const SpreadButton = ({
  isToken,
  isClickedForSpread,
  setClickedForSpread,
  setStateGroup,
  onSpreadClick,
  ...props
}) => {
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );

  const handleClick = async e => {
    try {
      if (isClickedForSpread) return;
      setClickedForSpread(true);
      if (onSpreadClick) {
        onSpreadClick();
      } else {
        setStateGroup?.updateModalForm(prev => {
          return { ...prev, spread: !prev.spread };
        });
      }
    } catch (err) {
      if (isDevelopmentMode) {
        console.log(err);
      }
    } finally {
      setClickedForSpread(false);
    }
  };

  const loginButton = useRef(null);

  return (
    <div
      className={styles['spread']}
      onClick={handleClick} // React의 onClick 이벤트 핸들러는 비동기 처리를 기다리지 않아도 되도록 설계되어 있어요. React는 이벤트가 발생하면 함수를 바로 실행하고, 그 안에서 비동기 작업(await)이 완료되길 기다리지 않아도 괜찮아요. 그래서 onClick={handleClick}처럼 바로 함수를 연결해도 문제가 없는 거예요.
      ref={loginButton}
    >
    </div>
  );
};
