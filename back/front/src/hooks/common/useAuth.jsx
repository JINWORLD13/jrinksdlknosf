import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasAccessToken } from '../../utils/storage/tokenCookie.jsx';
import {
  hasAccessTokenForPreference,
  removeAccessTokensForPreference,
  removeRefreshTokensForPreference,
} from '../../utils/storage/tokenPreference.jsx';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { referralApi } from '../../api/referralApi.jsx';
import { Analytics, log } from '@/analytics';

const isNative = Capacitor.isNativePlatform();

/**
 * 인증 관련 로직을 처리하는 커스텀 훅
 * @returns {Object} { isToken, isCheckingToken, signin, logout }
 */
const useAuth = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const appUrlScheme = 'cosmostarot';
  const appHost = new URL(import.meta.env.VITE_SERVER_URL).hostname;

  // 토큰 체크
  useEffect(() => {
    const checkToken = async () => {
      setIsCheckingToken(true);
      try {
        if (isNative) {
          const hasToken = await hasAccessTokenForPreference();
          setIsToken(hasToken);
        } else {
          setIsToken(hasAccessToken());
        }
      } finally {
        setIsCheckingToken(false);
      }
    };
    checkToken();
  }, []);

  // 로그인 성공 후, 보류된 추천 코드가 있으면 보상 청구
  const previousTokenState = React.useRef(isToken);
  useEffect(() => {
    const tryClaimReferral = async () => {
      if (!isToken) return;

      // Firebase Analytics: 로그인 성공 추적 (이전에 로그인 안 했던 경우)
      if (!previousTokenState.current && isToken) {
        Analytics.login('google');

        // 추천 코드가 있으면 추적
        try {
          let referrerId;
          if (isNative) {
            const { value } = await Preferences.get({
              key: 'pending_referrer_id',
            });
            referrerId = value;
          } else {
            referrerId = localStorage.getItem('pending_referrer_id');
          }
          if (referrerId) {
            Analytics.referral_open(referrerId);
          }
        } catch (_) {
          // 추천 코드 추적 실패는 무시
        }
      }

      previousTokenState.current = isToken;

      // 추천 코드 보상 청구
      try {
        let referrerId;
        if (isNative) {
          const { value } = await Preferences.get({
            key: 'pending_referrer_id',
          });
          referrerId = value;
        } else {
          referrerId = localStorage.getItem('pending_referrer_id');
        }
        if (!referrerId) return;
        await referralApi.claimReferral(referrerId);
      } catch (_) {
        // noop
      } finally {
        try {
          if (isNative) {
            await Preferences.remove({ key: 'pending_referrer_id' });
          } else {
            localStorage.removeItem('pending_referrer_id');
          }
        } catch (_) {}
      }
    };
    tryClaimReferral();
  }, [isToken]);

  // 로그인
  const signin = async (isAnsweredForRedux, isWaitingForRedux) => {
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
      });
    } else {
      window.open(loginUrl, '_self');
    }
  };

  // 로그아웃
  const logout = async (isAnsweredForRedux, isWaitingForRedux) => {
    if (isAnsweredForRedux || isWaitingForRedux) return;

    // Firebase Analytics: 로그아웃 추적
    log('logout', {
      method: 'google',
    });

    const logoutUrl = `${serverUrl}/authenticate/oauth/google/logout`;

    if (isNative) {
      await Preferences.set({ key: 'wasSignedIn', value: 'true' }); // 로그인 상태 저장(중요)
    } else {
      localStorage.setItem('wasSignedIn', 'true'); // 로그인 상태 저장(중요)
    }

    if (isNative) {
      await removeAccessTokensForPreference();
      await removeRefreshTokensForPreference();
      navigate('/'); // 홈으로 리다이렉트
      window.location.reload();
    } else {
      window.location.reload();
      window.open(logoutUrl, '_self');
    }
  };

  return {
    isToken,
    isCheckingToken,
    signin,
    logout,
  };
};

export default useAuth;
