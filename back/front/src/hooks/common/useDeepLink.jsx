import { useEffect } from 'react';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import {
  setAccessTokenForPreference,
  setRefreshTokenForPreference,
} from '../../utils/storage/tokenPreference.jsx';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { exchangeCodeForTokens } from '../../api/tokenExchangeApi.jsx';

const isNative = Capacitor.isNativePlatform();

/**
 * Capacitor 딥링크 처리를 위한 커스텀 훅
 * @param {string} appUrlScheme - 앱 URL 스킴 (예: 'cosmostarot')
 * @param {string} appHost - 앱 호스트 (예: 'cosmos-tarot.com')
 */
const useDeepLink = (appUrlScheme, appHost) => {
  useEffect(() => {
    if (!isNative) return;

    let isProcessing = false; // 중복 실행 방지 플래그

    const handleAppUrlOpen = async data => {
      // 이미 처리 중이면 무시
      if (isProcessing) {
        return;
      }

      isProcessing = true;

      try {
        // 로그인 및 로그아웃 후처리
        // Browser가 열려있지 않을 수 있으므로 try-catch로 감싸기
        try {
          await Browser.close();
          // Browser가 완전히 닫힐 때까지 약간의 딜레이
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (browserError) {
          // Browser가 이미 닫혀있거나 열려있지 않은 경우 무시
        }

        // 로그인 후 및 앱 딥링크로 진입 시 (추천코드 등 쿼리 처리)
        if (
          data.url.startsWith(`${appUrlScheme}://${appHost}`) ||
          data.url.startsWith(`https://${appHost}`)
        ) {
          const url = new URL(data.url);
          const code = url.searchParams.get('code'); // 임시 인증 코드 (신규 방식)
          const ref = url.searchParams.get('ref'); // 추천인 코드

          // 추천코드가 있으면 먼저 저장 (로그인 전에 보존)
          // 이 함수는 Native에서만 실행되므로 Preferences 사용
          if (ref) {
            try {
              await Preferences.set({ key: 'pending_referrer_id', value: ref });
            } catch (_) {}
          }

          // 신규 방식: code로 토큰 교환 (우선)
          if (code) {
            try {
              const { accessToken, refreshToken } = await exchangeCodeForTokens(
                code
              );

              await Promise.all([
                setAccessTokenForPreference(accessToken),
                setRefreshTokenForPreference(refreshToken),
              ]);

              // 성공하면 리턴 (폴백 실행 안 함)
              // 페이지 새로고침 전에 약간의 딜레이를 두어 Browser가 완전히 닫히도록 함
              await new Promise(resolve => setTimeout(resolve, 150));
              window.location.reload();
              return;
            } catch (error) {
              // 실패하면 아래 폴백으로 계속
            }
          }
        }

        // 페이지 새로고침 전에 약간의 딜레이를 두어 Browser가 완전히 닫히도록 함
        await new Promise(resolve => setTimeout(resolve, 150));
        window.location.reload();
      } catch (error) {
        // 에러 발생 시에도 페이지 새로고침 (사용자가 다시 로그인 시도할 수 있도록)
        await new Promise(resolve => setTimeout(resolve, 150));
        window.location.reload();
      } finally {
        // 플래그를 리셋하지 않음 (페이지가 reload되므로)
      }
    };

    // 앱에서만 딥링크 리스너 설정
    let urlOpenListener;
    const setupListener = async () => {
      try {
        urlOpenListener = await App.addListener('appUrlOpen', handleAppUrlOpen);
      } catch (error) {
        // 리스너 등록 실패 무시
      }
    };
    setupListener();

    return () => {
      if (urlOpenListener) {
        urlOpenListener.remove();
      }
    };
  }, [appUrlScheme, appHost]);
};

export default useDeepLink;
