/**
 * Firebase Analytics 유틸리티
 * Capacitor 네이티브 플러그인 사용
 * 웹에서는 Firebase SDK를 사용하도록 자동 전환
 */

import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import {
  logEvent as webLogEvent,
  setAnalyticsCollectionEnabled as setWebAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { getFirebaseAnalytics, isFirebaseConfigured } from './firebaseApp';
import { isDevelopmentMode } from './utils/constants/isDevelopmentMode';

const isNative = Capacitor.isNativePlatform();

// Email to exclude from analytics (use VITE_ANALYTICS_EXCLUDE_EMAIL in .env only)
const ANALYTICS_EXCLUDE_EMAIL = (
  import.meta.env.VITE_ANALYTICS_EXCLUDE_EMAIL || ''
)
  .trim()
  .toLowerCase();

let isCollectionEnabled = true;

/**
 * 로그인 이메일 기반으로 Analytics 수집 on/off
 * - 웹: Firebase SDK collectionEnabled 토글
 * - 네이티브: 호출 자체를 막아 수집 방지
 */
export function applyAnalyticsUserFilter(email?: string | null): void {
  const normalized = String(email || '').trim().toLowerCase();
  const shouldDisable =
    normalized.length > 0 && normalized === ANALYTICS_EXCLUDE_EMAIL;

  isCollectionEnabled = !shouldDisable;

  // 웹에서는 실제 collectionEnabled도 같이 내려서 확실히 차단
  if (!isNative) {
    const analytics = getFirebaseAnalytics();
    if (analytics) {
      try {
        setWebAnalyticsCollectionEnabled(analytics, isCollectionEnabled);
      } catch (e) {
        console.warn('setAnalyticsCollectionEnabled failed:', e);
      }
    }
  }

  if (isDevelopmentMode && normalized) {
    console.log('Analytics email filter applied:', {
      email: normalized,
      excluded: shouldDisable,
    });
  }
}

/**
 * 이벤트 파라미터 타입
 */
type EventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * 화면 이름 설정
 * 네이티브에서는 Capacitor 플러그인 사용, 웹에서는 Firebase SDK 사용
 * setCurrentScreen은 deprecated되었으므로 screen_view 이벤트로 대체
 */
export async function setScreen(name: string): Promise<void> {
  // log 함수를 사용하여 screen_view 이벤트 전송 (타입 안전성 보장)
  await log('screen_view', {
    screen_name: name,
    screen_class: name,
  });
}

/**
 * 커스텀 이벤트 전송
 * 네이티브에서는 Capacitor 플러그인 사용, 웹에서는 Firebase SDK 사용
 */
export async function log(name: string, params?: EventParams): Promise<void> {
  try {
    if (!isCollectionEnabled) return;

    if (isNative) {
      // 네이티브: Capacitor 플러그인 사용
      await FirebaseAnalytics.logEvent({
        name,
        params: params || {},
      });
      if (isDevelopmentMode) {
        console.log(`Firebase event: ${name}`, params || {});
      }
    } else {
      // 웹: Firebase SDK 사용
      const analytics = getFirebaseAnalytics();
      if (analytics) {
        await webLogEvent(analytics, name, params || {});
        if (isDevelopmentMode) {
          console.log(`Firebase event: ${name}`, params || {});
        }
      } else if (!isFirebaseConfigured()) {
        console.warn(
          'Firebase not configured. Set config in firebaseApp.ts.'
        );
      }
    }
  } catch (e) {
    console.warn(`logEvent(${name}) failed:`, e);
  }
}

/**
 * Analytics 헬퍼 클래스
 * 자주 사용하는 이벤트를 미리 정의해두면 사용이 깔끔해집니다.
 */
export const Analytics = {
  // 앱 실행
  app_open: () => log('app_open'),

  // 추천/리퍼럴
  referral_open: (code: string) => log('referral_open', { code }),

  // 타로 리딩
  tarot_read_start: (spread: string) => log('tarot_read_start', { spread }),
  tarot_read_complete: (spread: string, duration?: number) =>
    log('tarot_read_complete', {
      spread,
      ...(duration && { duration_seconds: Math.floor(duration / 1000) }),
    }),

  // 결과 해제
  tarot_read_result_unlock: (method: 'voucher' | 'ad' | 'iap') =>
    log('tarot_read_result_unlock', { method }),

  // 결제
  purchase: (sku: string, value: number, currency = 'KRW') =>
    log('purchase', { sku, value, currency }),

  purchase_start: (sku: string, value: number, currency = 'KRW') =>
    log('begin_checkout', {
      currency,
      value,
      item_id: sku,
      item_name: sku,
      price: value,
    }),

  // 광고
  ad_click: (adType: string, adId?: string) =>
    log('ad_click', { ad_type: adType, ...(adId && { ad_id: adId }) }),

  ad_impression: (adType: string, adId?: string) =>
    log('ad_impression', { ad_type: adType, ...(adId && { ad_id: adId }) }),

  // 사용자 행동
  login: (method = 'google') => log('login', { method }),
  sign_up: (method = 'google') => log('sign_up', { method }),

  // 화면 이동
  screen_view: (screenName: string) => {
    setScreen(screenName);
    log('screen_view', { screen_name: screenName });
  },
};
