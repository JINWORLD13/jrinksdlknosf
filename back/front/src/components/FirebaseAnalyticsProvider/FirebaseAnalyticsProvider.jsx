/**
 * Firebase Analytics Provider
 * 앱 전체에서 Firebase Analytics를 자동으로 추적
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import firebaseAnalytics from '../../services/firebaseAnalytics';
import { usePageViewTracking } from '../../hooks/useFirebaseAnalytics';
import { applyAnalyticsUserFilter } from '../../analytics';
import {
  getCountryCode,
  detectCountryFromBrowser,
} from '../../utils/country/detectCountry';
import { isBot } from '../../utils/validation/isBot';

/**
 * 참고: 도시 정보는 Firebase Analytics가 IP 기반으로 자동 감지합니다.
 * 타임존 기반 도시 감지는 부정확할 수 있으므로 사용하지 않습니다.
 * (예: 일본 전체가 "Asia/Tokyo" 타임존을 사용하므로 모두 도쿄로 표시될 수 있음)
 */

const FirebaseAnalyticsProvider = ({ children }) => {
  const user = useSelector(state => state.user?.currentUser);
  const userInfo = useSelector(state => state.userInfoStore?.userInfo);

  // 봇/크롤러 체크
  const isCrawler = typeof window !== 'undefined' && isBot();

  // 특정 이메일은 Analytics 수집 제외
  useEffect(() => {
    if (isCrawler) return;
    const email = userInfo?.email;
    firebaseAnalytics.applyEmailFilter?.(email);
    applyAnalyticsUserFilter(email);
  }, [userInfo?.email, isCrawler]);

  // Firebase Analytics 초기화 및 위치 정보 설정
  useEffect(() => {
    // 봇/크롤러는 Analytics 추적하지 않음
    if (isCrawler) {
      if (import.meta.env.DEV) {
        console.log('Bot/crawler detected: skipping Analytics');
      }
      return;
    }

    // 앱 실행 이벤트
    firebaseAnalytics.trackAppOpen();

    // 사용자 정보가 있으면 사용자 ID 설정
    if (user) {
      firebaseAnalytics.setUser(user.id);
    }
  }, [user, isCrawler]);

  // 위치 정보 및 사용자 속성 설정 (별도 useEffect로 분리하여 항상 실행)
  useEffect(() => {
    // 봇/크롤러는 Analytics 추적하지 않음
    if (isCrawler) {
      return;
    }

    // 브라우저 언어 감지
    const browserLanguage =
      navigator.language || navigator.userLanguage || 'ko';
    const language = browserLanguage.split('-')[0].toLowerCase();

    // 국가 코드 감지 (우선순위: userInfo.country > 브라우저 감지 > 언어 추론)
    const country = getCountryCode({
      userCountry: userInfo?.country,
      language: language,
    });

    // 사용자 속성 설정
    const userProperties = {
      // 기존 속성
      ...(user && {
        user_tier: user.tier || 'free',
        signup_date: user.createdAt,
      }),
      // 위치 정보 추가
      // 참고:
      // - Firebase Analytics의 기본 "Country" 차원은 IP 기반으로 자동 감지됨
      // - "country"는 예약된 속성명이므로 사용자 정의 속성으로 사용 불가
      // - 따라서 사용자 정의 속성으로 "detected_country"를 설정하여 보완
      // - 도시 정보는 Firebase Analytics가 IP 기반으로 자동 감지하므로 설정하지 않음
      ...(country && { detected_country: country }),
      // userInfo에서 시군구 정보가 있으면 설정 (한국 사용자의 경우)
      ...(userInfo?.districtCode && {
        district_code: userInfo.districtCode,
      }),
    };

    // 사용자 속성 설정 (매번 설정하여 최신 정보 유지)
    firebaseAnalytics.setUserProps(userProperties);

    // 개발 모드에서만 로그 출력
    if (import.meta.env.DEV) {
      console.log('Firebase set location:', {
        country,
        districtCode: userInfo?.districtCode,
        userCountry: userInfo?.country,
        language,
        note: '도시 정보는 Firebase Analytics가 IP 기반으로 자동 감지합니다',
      });
    }
  }, [user, userInfo, isCrawler]);

  // 페이지 뷰 자동 추적
  usePageViewTracking();

  // 앱 종료 시 (웹에서는 제한적)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Firebase는 자동으로 세션 관리
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 에러 자동 추적
  useEffect(() => {
    // 봇/크롤러는 에러 추적하지 않음
    if (isCrawler) {
      return;
    }

    const handleError = event => {
      firebaseAnalytics.trackError(
        'javascript_error',
        event.message || 'Unknown error'
      );
    };

    const handleUnhandledRejection = event => {
      firebaseAnalytics.trackError(
        'promise_rejection',
        event.reason?.message || String(event.reason)
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, [isCrawler]);

  // 앱 백그라운드/포그라운드 추적
  useEffect(() => {
    // 봇/크롤러는 백그라운드/포그라운드 추적하지 않음
    if (isCrawler) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        firebaseAnalytics.trackAppBackground();
      } else {
        firebaseAnalytics.trackAppForeground();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCrawler]);

  return <>{children}</>;
};

export default FirebaseAnalyticsProvider;
