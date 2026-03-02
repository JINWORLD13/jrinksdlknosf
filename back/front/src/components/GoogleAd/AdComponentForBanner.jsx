import React, { useEffect, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob';
import { useTranslation } from 'react-i18next';
import { initializeAdMob } from './initializeAdMob';
import { initializeAdSense } from './initializeAdsense';
import { getLocalizedContent } from './getLocalizedContent';
import { ADSENSE_IDS } from '@/config/adIds.example';
import { setIsAnswered, setIsWaiting } from '../../store/booleanStore';
import { isAdsFreePassValid } from '../../lib/user/isAdsFreePassValid';
import { isDevelopmentMode, isProductionMode } from '@/utils/constants';

const isNative = Capacitor.isNativePlatform();

const AdComponentForBanner = ({ userInfo, isSignedIn = true, ...props }) => {
  const content = getLocalizedContent();
  const [error, setError] = useState(null);
  const [adLoaded, setAdLoaded] = useState(false);

  const selectedAdType = 3;

  const handleCancel = useCallback(e => {
    setError(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await AdMob.removeAllListeners();
      await AdMob.removeBanner();
    } catch (e) {
      console.warn('Banner remove error:', e);
    }
    window.location.reload();
  }, []);

  let listeners = {};
  let cleanup = async () => {
    await AdMob.removeAllListeners();
    //한글 위 리스너들은 제거만 해둠. 안 넣으면 에러 나는 것 같아서 유지.
    //일어 上記リスナーは削除のみ。外すとエラーになりそうなため維持。
    //영어 Keep listener removal; removing them may cause errors.
    //한글 파괴를 하지 않으면 중복·겹침. 기존 배너 제거 필요. 타계정 로그인 시 initialFunction은 사라져도 배너는 유지됨.
    //일어 破棄しないと重複・重なり。既存バナー削除が必要。他アカウントログイン時もバナーは残る。
    //영어 Must destroy or banner duplicates/overlaps; survives account switch.
    await AdMob.removeBanner();
  };

  useEffect(() => {
    let initialFunction;
    const initializeAd = async () => {
      if (error === null) {
        try {
          if (isNative) {
            if (error !== null) return;

            //한글 기존 배너 제거 후 새로 초기화
            //일어 既存バナー削除後に再初期化
            //영어 Remove existing banner then re-initialize
            try {
              await AdMob.removeBanner();
              await AdMob.removeAllListeners();
            } catch (e) {
              //한글 배너가 없을 경우 에러 무시
              //일어 バナーがない場合はエラー無視
              //영어 Ignore error when no banner exists
            }

            initialFunction = await initializeAdMob({
              setError,
              selectedAdType,
              userInfo,
              content,
              listeners,
              margin: props?.margin,
              position: props?.position,
            });
            if (isDevelopmentMode) {
              console.log(
                '*************************initialFunction : ',
                JSON.stringify(initialFunction)
              );
              console.log(
                '*************************isSignedIn : ',
                JSON.stringify(isSignedIn)
              );
            }
          } else {
            await initializeAdSense(
              setError,
              setAdLoaded,
              undefined,
              undefined
            );
          }
        } catch (error) {
          console.error('Ad initialization error:', error);
          setError('AD_INIT_FAILED');
        }
      }
    };

    if (!isAdsFreePassValid(userInfo)) {
      initializeAd();
    } else {
      //한글 광고 제거 패스가 유효하면 배너 제거
      //일어 広告除去パスが有効ならバナー削除
      //영어 If ads-free pass valid, remove banner
      if (isNative) {
        (async () => {
          try {
            await AdMob.removeBanner();
            await AdMob.removeAllListeners();
          } catch (e) {
            //한글 배너가 없을 경우 에러 무시
            //일어 バナーがない場合はエラー無視
            //영어 Ignore error when no banner exists
          }
        })();
      }
    }

    return () => {
      cleanup();
      //한글 즉시 실행되는 IIFE로 비동기 호출
      //일어 即時実行IIFEで非同期呼び出し
      //영어 Async call via IIFE
      (async () => {
        try {
          await AdMob.removeAllListeners();
          await AdMob.removeBanner();
        } catch (e) {
          //한글 cleanup 중 에러 무시
          //일어 クリーンアップ中のエラー無視
          //영어 Ignore errors during cleanup
        }
      })();
      Object.values(listeners).forEach(listener => listener.remove());
      listeners = {};
    };
  }, [
    error,
    initializeAdMob,
    initializeAdSense,
    selectedAdType,
    userInfo?.email,
  ]);

  return (
    <>
      {!isNative && adLoaded && ADSENSE_IDS.CLIENT && ADSENSE_IDS.SLOT ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          data-ad-client={ADSENSE_IDS.CLIENT}
          data-ad-slot={ADSENSE_IDS.SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </>
  );
};

export default AdComponentForBanner;
