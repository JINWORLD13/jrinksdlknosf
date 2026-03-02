/**
 * Firebase 웹 앱 초기화
 * 웹 환경에서만 Firebase App을 초기화합니다.
 * 네이티브(Android/iOS)에서는 @capacitor-firebase/analytics 플러그인이 자동으로 처리합니다.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { Capacitor } from '@capacitor/core';
import { isDevelopmentMode } from './utils/constants/isDevelopmentMode';

// ============================================================================
// Firebase 설정
// ============================================================================

/**
 * Firebase 프로젝트 설정
 * Android 앱: Firebase Console에 등록됨, google-services.json 있음
 * 웹 앱: Firebase Console에서 웹 앱 추가 완료, .env 파일에 설정값 추가 필요
 *
 * 환경 변수에서 설정값을 가져오며, 없으면 기본값(빈 문자열) 사용
 * .env 파일에 VITE_FIREBASE_* 값들을 설정해주세요
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// ============================================================================
// 상태 관리
// ============================================================================

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let initializationAttempted = false;
let initializationPromise: Promise<void> | null = null;

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * Firebase 설정이 완료되었는지 확인
 * 환경 변수에서 값이 제대로 설정되었는지 검증
 */
export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey.length > 0 &&
    firebaseConfig.projectId.length > 0 &&
    firebaseConfig.appId.length > 0 &&
    firebaseConfig.authDomain.length > 0 &&
    firebaseConfig.messagingSenderId.length > 0
  );
}

/**
 * 웹 환경인지 확인
 */
function isWebEnvironment(): boolean {
  return typeof window !== 'undefined' && !Capacitor.isNativePlatform();
}

/**
 * Analytics가 지원되는 환경인지 확인
 */
async function checkAnalyticsSupport(): Promise<boolean> {
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

// ============================================================================
// 초기화 함수
// ============================================================================

/**
 * 웹 환경에서 Firebase 앱 및 Analytics 초기화
 * 네이티브 환경에서는 호출되지 않습니다 (Capacitor 플러그인이 처리)
 *
 * @returns 초기화 성공 여부
 */
export async function ensureFirebaseWebInitialized(): Promise<boolean> {
  // 네이티브 환경이면 초기화하지 않음
  if (!isWebEnvironment()) {
    if (Capacitor.isNativePlatform()) {
      // 네이티브 환경에서는 Capacitor 플러그인이 자동 처리
      return false;
    }
    return false;
  }

  // 설정이 완료되지 않았으면 초기화하지 않음
  if (!isFirebaseConfigured()) {
    if (isDevelopmentMode) {
      console.warn(
        'Firebase 설정이 완료되지 않았습니다. firebaseConfig를 확인해주세요.'
      );
    }
    return false;
  }

  // 이미 초기화 시도가 진행 중이면 기존 Promise 반환
  if (initializationPromise) {
    await initializationPromise;
    return analytics !== null;
  }

  // 이미 초기화되어 있으면 성공 반환
  if (app !== null && analytics !== null) {
    return true;
  }

  // 기존 앱이 있으면 재사용
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    try {
      // Analytics 지원 여부 확인
      const analyticsSupported = await checkAnalyticsSupport();
      if (analyticsSupported) {
        analytics = getAnalytics(app);
        if (isDevelopmentMode) {
          console.log(
            'Firebase Analytics (웹) 초기화 성공 (기존 앱 재사용)'
          );
        }
        initializationAttempted = true;
        return true;
      } else {
        if (isDevelopmentMode) {
          console.warn(
            'Firebase Analytics는 이 환경에서 지원되지 않습니다.'
          );
        }
        return false;
      }
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Firebase Analytics init failed:', error);
      }
      return false;
    }
  }

  // 새로운 앱 초기화
  initializationPromise = (async () => {
    try {
      // Firebase 앱 초기화
      app = initializeApp(firebaseConfig);

      // Analytics 지원 여부 확인 후 초기화
      const analyticsSupported = await checkAnalyticsSupport();
      if (analyticsSupported) {
        analytics = getAnalytics(app);
        if (isDevelopmentMode) {
          console.log('Firebase Analytics (web) init success');
        }
        initializationAttempted = true;
      } else {
        if (isDevelopmentMode) {
          console.warn(
            'Firebase Analytics는 이 환경에서 지원되지 않습니다.'
          );
          console.log(
            'Firebase App은 초기화되었지만 Analytics는 사용할 수 없습니다.'
          );
        }
      }
    } catch (error) {
      if (isDevelopmentMode) {
        console.error('Firebase 초기화 실패:', error);
      }
      app = null;
      analytics = null;
      throw error;
    } finally {
      initializationAttempted = true;
      initializationPromise = null;
    }
  })();

  try {
    await initializationPromise;
    return analytics !== null;
  } catch {
    return false;
  }
}

/**
 * 동기 버전의 초기화 함수 (하위 호환성)
 * 비동기 작업을 시작하지만 완료를 기다리지 않습니다.
 * @returns void
 */
export function ensureFirebaseWebInitializedSync(): void {
  if (!initializationAttempted) {
    ensureFirebaseWebInitialized().catch(error => {
      if (isDevelopmentMode) {
        console.error('Firebase init error:', error);
      }
    });
  }
}

// ============================================================================
// 인스턴스 반환 함수
// ============================================================================

/**
 * 초기화된 Firebase App 인스턴스 반환
 * @returns Firebase App 인스턴스 또는 null
 */
export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

/**
 * 초기화된 Analytics 인스턴스 반환 (웹 전용)
 * @returns Analytics 인스턴스 또는 null
 */
export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}

/**
 * 초기화 상태 확인
 * @returns 초기화 시도 여부
 */
export function isInitialized(): boolean {
  return initializationAttempted;
}

/**
 * Analytics 사용 가능 여부 확인
 * @returns Analytics가 사용 가능한지 여부
 */
export function isAnalyticsAvailable(): boolean {
  return analytics !== null;
}
