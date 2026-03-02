import React, { useState, useEffect, useMemo } from 'react';
import styles from './Footer.module.scss';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import AdComponentForBanner from '../GoogleAd/AdComponentForBanner.jsx';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { isNativeAppVertical } from '../../utils/device/detectVertical.js';
import { hasAccessToken } from '../../utils/storage/tokenCookie.jsx';
import {
  getAdsFree,
  hasAccessTokenForPreference,
} from '../../utils/storage/tokenPreference.jsx';
import { useSelector } from 'react-redux';
import { isAdsFreePassValid } from '../../lib/user/isAdsFreePassValid.jsx';
import { useLocation } from 'react-router-dom';
import { useFirebaseAnalytics } from '@/hooks/useFirebaseAnalytics.jsx';
import { AdMob } from '@capacitor-community/admob';

const isNative = Capacitor.isNativePlatform();

const Footer = props => {
  const location = useLocation();
  const { trackSocialShare, trackButtonClick } = useFirebaseAnalytics();
  const browserLanguage = useLanguageChange();
  const userInfoInRedux = useSelector(state => state.userInfoStore.userInfo);
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );
  const isReadyToShowDurumagiForRedux = useSelector(
    state => state.booleanStore.isReadyToShowDurumagi
  );
  const { t } = useTranslation();
  // 총 인용구 세트 수
  // 引用句セット総数
  // Total quote sets count
  const totalQuoteSets = 3;
  const [isFreeAdsMode, setFreeAdsMode] = useState(false);
  const [currentQuoteSet, setCurrentQuoteSet] = useState(null);

  // 배너 상태를 초기값 없이 설정
  // バナー状態を初期値なしで設定
  // Banner state without initial value
  const [isBannerOpen, setBannerOpen] = useState(false);
  const [isNativeScreenVertical, setNativeScreenVertical] = useState(() => {
    return isNative && isNativeAppVertical();
  });
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    if (isNative) {
      hasAccessTokenForPreference().then(setIsSignedIn);
    } else {
      setIsSignedIn(hasAccessToken());
    }
  }, [userInfoInRedux]); // userInfoInRedux 등 필요한 의존성 추가 // 依存配列 // Dependency array

  // 저장소에서 currentQuoteSet 가져오기
  // ストレージからcurrentQuoteSet取得
  // Get currentQuoteSet from storage
  const getStoredQuoteSet = async () => {
    try {
      if (isNative) {
        const { value } = await Preferences.get({ key: 'currentQuoteSet' });
        return value ? parseInt(value, 10) : 1;
      } else {
        const stored = localStorage.getItem('currentQuoteSet');
        return stored ? parseInt(stored, 10) : 1;
      }
    } catch (error) {
      console.error('Storage access error:', error);
      return 1;
    }
  };

  // 저장소에 currentQuoteSet 저장하기
  // ストレージにcurrentQuoteSet保存
  // Save currentQuoteSet to storage
  const setStoredQuoteSet = async value => {
    try {
      if (isNative) {
        await Preferences.set({
          key: 'currentQuoteSet',
          value: value.toString(),
        });
      } else {
        localStorage.setItem('currentQuoteSet', value.toString());
      }
    } catch (error) {
      console.error('Storage save error:', error);
    }
  };

  // 로그인 상태 변경 시 처리 (로그인 시에만 리셋)
  // ログイン状態変更時の処理（ログイン時のみリセット）
  // Handle login state change (reset on login only)
  useEffect(() => {
    const initializeQuoteSet = async () => {
      const storedQuoteSet = await getStoredQuoteSet();
      let wasSignedOut;
      if (isNative) {
        const { value } = await Preferences.get({ key: 'wasSignedIn' });
        wasSignedOut = value !== 'true'; // 이전에 로그인 상태가 아니었는지 확인 // 未ログインだったか // Was previously signed out
      } else {
        wasSignedOut = localStorage.getItem('wasSignedIn') !== 'true';
      }

      if (isSignedIn) {
        // 로그인 상태
        // ログイン状態
        // Signed in
        if (wasSignedOut) {
          // 로그인 직후. 로그아웃→로그인 전환 시에만 currentQuoteSet 1로 리셋
          // ログイン直後。ログアウト→ログイン時のみリセット
          // Just signed in; reset quote set only on logout→login
          setCurrentQuoteSet(1);
          await setStoredQuoteSet(1);
          // 처리 후 로그인했던 상태로 저장
          // 処理後ログイン状態で保存
          // Save as signed-in after handling
          if (isNative) {
            await Preferences.set({
              key: 'wasSignedIn',
              value: 'true',
            }); // 로그인 상태 저장(중요) // ログイン状態保存 // Store signed-in (important)
          } else {
            localStorage.setItem('wasSignedIn', 'true'); // 로그인 상태 저장(중요) // 同上 // Same
          }
        } else {
          // 로그인 상태에서 새로고침 시 저장소 값 사용
          // ログイン状態でリロード時はストレージ値を使用
          // On refresh while signed in, use stored value
          setCurrentQuoteSet(storedQuoteSet);
        }
      } else if (isSignedIn === false && isSignedIn !== null) {
        // 초기값 false면 비동기로 잠깐 false가 되어 false 분기 실행됨. null로 구분.
        // 初期値falseだと非同期で一瞬falseになり誤実行。nullで区別。
        // Initial false triggers false branch briefly; use null to distinguish.
        // 비로그인 상태
        // 未ログイン状態
        // Signed out
        if (wasSignedOut) {
          // 로그아웃된 상태에서 새로고침 시 저장소 값 사용
          // ログアウト状態でリロード時はストレージ値を使用
          // On refresh while signed out, use stored value
          setCurrentQuoteSet(storedQuoteSet);
        } else {
          // 로그인→바로 로그아웃한 상태. 저장소 값 사용 후 로그아웃 상태로 저장
          // ログイン→即ログアウト。ストレージ値使用後に未ログインで保存
          // Signed in then signed out; use stored value then save signed-out
          setCurrentQuoteSet(storedQuoteSet);

          if (isNative) {
            await Preferences.set({
              key: 'wasSignedIn',
              value: 'false',
            }); // 로그아웃 상태 저장(중요) // 未ログイン状態保存 // Store signed-out (important)
          } else {
            localStorage.setItem('wasSignedIn', 'false'); // 로그아웃 상태 저장(중요) // 同上 // Same
          }
        }
      }
    };

    initializeQuoteSet();
  }, [isSignedIn]); // isSignedIn 변경 시 실행 // isSignedIn変更時に実行 // Run when isSignedIn changes

  // currentQuoteSet 변경 시 저장소 업데이트
  // currentQuoteSet変更時にストレージ更新
  // Update storage when currentQuoteSet changes
  useEffect(() => {
    if (currentQuoteSet) setStoredQuoteSet(currentQuoteSet);
  }, [currentQuoteSet]);

  useEffect(() => {
    let isFree = async () => {
      const result = await getAdsFree(userInfoInRedux);
      setFreeAdsMode(result);
    };
    isFree();
  }, [userInfoInRedux]);

  useEffect(() => {
    if (!isNative) return;

    const handleResize = () => {
      setNativeScreenVertical(isNativeAppVertical());
    };

    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleResize);
    if (typeof window !== 'undefined')
      window.addEventListener('orientationchange', handleResize);

    // 초기값도 반영
    // 初期値も反映
    // Apply initial value too
    handleResize();

    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('resize', handleResize);
      if (typeof window !== 'undefined')
        window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 현재 경로가 홈 화면인지 체크
  // 現在パスがホーム画面かチェック
  // Check if current path is home
  const isHomePage = useMemo(() => {
    const normalizedPath = location.pathname.replace(/\/$/, '') || '/';
    const homePath = `/${browserLanguage}`;
    return normalizedPath === '/' || normalizedPath === homePath;
  }, [location.pathname, browserLanguage]);

  // 배너 표시 여부 처리
  // バナー表示可否の処理
  // Handle whether to show banner
  useEffect(() => {
    const handleBannerState = async () => {
      if (isNative) {
        const shouldShowBanner =
          isNative &&
          // 광고제거 아님 // 広告除去でない // Not ads-free
          !isAdsFreePassValid(userInfoInRedux) &&
          // 완전 초기상태가 아님 // 完全初期状態でない // Not initial idle
          !(
            !props?.answerFormForApp?.isWaiting &&
            !props?.answerFormForApp?.isAnswered &&
            !isWaitingForRedux &&
            !isAnsweredForRedux
          ) &&
          !props?.modalFormForApp?.spread &&
          !props?.modalFormForApp?.tarot &&
          // Home 화면인 경우만 배너 표시 // ホーム画面のときのみ // Only on home
          isHomePage &&
          // 두루마기 모달(AI 해석) 열려있지 않을 때만 // ずるまきモーダル閉時のみ // Only when durumagi modal closed
          !props?.isDurumagiModalWithInterpretationOpen &&
          // 핵심: 기다릴 때 / 이용권모드에서 두루마기 준비 전+답변 후 / 광고 모드에서 광고 시청 후 두루마기 준비 전
          // 待機中、チケットモードで回答後ずるまき前、広告視聴後ずるまき前
          // Waiting; or voucher mode after answer before durumagi; or after ad before durumagi
          (props?.answerFormForApp?.isWaiting ||
            (props?.answerFormForApp?.isAnswered &&
              !isReadyToShowDurumagiForRedux &&
              props?.isVoucherModeOnForApp) ||
            (props?.hasWatchedAdForApp &&
              !isReadyToShowDurumagiForRedux &&
              !props?.isVoucherModeOnForApp &&
              props?.selectedTarotModeForApp === 2));

        // 배너를 숨겨야 하는데 현재 표시 중이면 명시적으로 제거
        // バナー非表示にすべきなのに表示中なら明示的に削除
        // If banner should be hidden but is open, remove explicitly
        if (!shouldShowBanner && isBannerOpen) {
          try {
            await AdMob.removeBanner();
            await AdMob.removeAllListeners();
          } catch (error) {
            console.warn('Footer banner remove error:', error);
          }
        }

        setBannerOpen(shouldShowBanner);
        setNativeScreenVertical(isNativeAppVertical());
      } else {
        setBannerOpen(false);
      }
    };

    handleBannerState();
  }, [
    isNativeScreenVertical,
    isSignedIn,
    isWaitingForRedux,
    isAnsweredForRedux,
    isReadyToShowDurumagiForRedux,
    props?.answerFormForApp?.isWaiting,
    props?.answerFormForApp?.isAnswered,
    props?.modalFormForApp?.spread,
    props?.modalFormForApp?.tarot,
    props?.selectedTarotModeForApp,
    props?.isVoucherModeOnForApp,
    props?.hasWatchedAdForApp,
    props?.isDurumagiModalWithInterpretationOpen,
    userInfoInRedux,
    isFreeAdsMode,
    isHomePage,
    isBannerOpen,
  ]);

  // 20초마다 인용구 회전
  // 20秒ごとに引用句をローテーション
  // Rotate quote set every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteSet(prevSet => (prevSet % totalQuoteSets) + 1);
    }, 20000); // 20초마다 전환 // 20秒間隔 // 20s interval

    return () => clearInterval(intervalId);
  }, []);

  const renderQuoteSet = setNumber => (
    <>
      <div
        className={
          browserLanguage === 'ja'
            ? styles['quotation-japanese']
            : styles['quotation']
        }
      >
        {t(`footer.quotation${setNumber}-1`)}
      </div>
      <div
        className={
          browserLanguage === 'ja'
            ? styles['quotation-japanese']
            : styles['quotation']
        }
      >
        {t(`footer.quotation${setNumber}-2`)}
      </div>
    </>
  );

  // currentQuoteSet이 null일 때는 아무것도 렌더링하지 않음
  // currentQuoteSetがnullのときは何も描画しない
  // Render nothing when currentQuoteSet is null
  if (currentQuoteSet === null) return null;

  return (
    <footer className={styles.footer}>
      {/* {isBannerOpen &&                  
        !isAdsFreePassValid(userInfoInRedux) &&
        isNativeScreenVertical && (
          <AdComponentForBanner
            userInfo={userInfoInRedux}
            isSignedIn={isSignedIn}
            position={
              isNativeScreenVertical ? 'BOTTOM_CENTER' : 'BOTTOM_CENTER'
            } // 배너 하단 여백
            margin={isNativeScreenVertical ? 80 : 0} // 배너 하단 여백
          />
        )}
      {isBannerOpen &&
        !isAdsFreePassValid(userInfoInRedux) &&
        !isNativeScreenVertical && (
          <AdComponentForBanner
            userInfo={userInfoInRedux}
            isSignedIn={isSignedIn}
            position={
              isNativeScreenVertical ? 'BOTTOM_CENTER' : 'BOTTOM_CENTER'
            } // 배너 하단 여백
            margin={isNativeScreenVertical ? 80 : 0} // 배너 하단 여백
          />
        )} */}
      {renderQuoteSet(currentQuoteSet)}
      {/* <div className={styles['email']}>Email: cosmostarotinfo@gmail.com</div> */}
    </footer>
  );
};

export default Footer;
