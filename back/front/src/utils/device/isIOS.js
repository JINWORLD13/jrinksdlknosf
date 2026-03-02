import { Capacitor } from '@capacitor/core';

/**
 * iOS(iPhone/iPad) 여부.
 * - isNative(Capacitor): getPlatform() === 'ios' 사용.
 * - 웹: navigator.userAgent로 iPhone/iPad 판별 (동일 WebKit 이슈 대비).
 */
export function isIOS() {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform() === 'ios';
  }
  return /(iPhone|iPad)/i.test(navigator.userAgent);
}
