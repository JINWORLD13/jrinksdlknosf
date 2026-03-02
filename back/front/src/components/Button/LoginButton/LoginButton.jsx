import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { useSelector } from 'react-redux';
import { isDevelopmentMode } from '@/utils/constants';
import styles from './LoginButton.module.scss';

export const LoginButton = ({
  isToken,
  isClickedForLogin,
  setClickedForLogin,
  ...props
}) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const appUrlScheme = 'cosmostarot';
  const appHost = new URL(import.meta.env.VITE_SERVER_URL).hostname;
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );

  // 딥링크 처리는 Navbar.jsx에서 전역으로 처리됨 (중복 방지)

  //! capacitor용 함수
  const signin = async () => {
    if (isAnsweredForRedux || isWaitingForRedux) return;
    const loginUrl = `${serverUrl}/authenticate/oauth/google/start`;
    if (isNative) {
      await Preferences.set({ key: 'wasSignedIn', value: 'false' }); // 비로그인 상태 저장(중요)
    } else {
      localStorage.setItem('wasSignedIn', 'false'); // 비로그인 상태 저장(중요)
    }
    if (isNative) {
      // 추천 코드가 있으면 redirect_uri에 포함
      let redirectUrl = `${appUrlScheme}://${appHost}`;
      try {
        const { value: pendingRef } = await Preferences.get({
          key: 'pending_referrer_id',
        });
        if (pendingRef) {
          const url = new URL(redirectUrl);
          url.searchParams.set('ref', pendingRef);
          redirectUrl = url.toString();
        }
      } catch (error) {
        // 추천 코드 확인 실패 시 무시하고 계속 진행
        console.log('Failed to get referral code:', error);
      }

      await Browser.open({
        url: `${loginUrl}?redirect_uri=${encodeURIComponent(redirectUrl)}`,
        windowName: '_self',
      });
    } else {
      if (typeof window !== 'undefined') window.location.reload();
      if (typeof window !== 'undefined') window.open(loginUrl, '_self');
    }
  };

  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLocked(false);
    }, 500); // 0.5초 후에 버튼 잠금 해제
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClick = async e => {
    try {
      if (isClickedForLogin || isLocked) return;
      setClickedForLogin(true);
      await signin();
    } catch (err) {
      if (isDevelopmentMode) {
        console.log(err);
      }
    } finally {
      setClickedForLogin(false);
    }
  };

  const loginButton = useRef(null);

  return (
    <div
      className={styles['login']}
      onClick={handleClick} // React의 onClick 이벤트 핸들러는 비동기 처리를 기다리지 않아도 되도록 설계되어 있어요. React는 이벤트가 발생하면 함수를 바로 실행하고, 그 안에서 비동기 작업(await)이 완료되길 기다리지 않아도 괜찮아요. 그래서 onClick={handleClick}처럼 바로 함수를 연결해도 문제가 없는 거예요.
      ref={loginButton}
    >
      <p>Login</p>
    </div>
  );
};
