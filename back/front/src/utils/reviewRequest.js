import { Capacitor } from '@capacitor/core';

export const REVIEW_REQUEST_PREF_KEY = 'reviewRequestShown';

/**
 * 사용자별 Preferences 키 (이메일 포함해 구분).
 * @param {string} [email] - 사용자 이메일 (없으면 비로그인용 단일 키)
 * @returns {string}
 */
export const getReviewRequestPrefKey = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return REVIEW_REQUEST_PREF_KEY;
  }
  const safe = email.trim().replace(/@/g, '_at_').replace(/\./g, '_');
  return `${REVIEW_REQUEST_PREF_KEY}_${safe}`;
};

/**
 * 네이티브 앱에서 스토어 리뷰 페이지 URL (플랫폼별). iOS App ID는 앱 등록 후 설정.
 */
export const getStoreReviewUrl = () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'android') {
    const lang =
      (typeof navigator !== 'undefined' && navigator.language?.slice(0, 2)) ||
      'en';
    const hl = ['ko', 'ja', 'en'].includes(lang) ? lang : 'en';
    return `https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot&hl=${hl}`;
  }
  if (platform === 'ios') {
    const iosAppId = 'YOUR_IOS_APP_ID';
    return iosAppId.startsWith('YOUR_')
      ? 'https://apps.apple.com/app/id1234567890'
      : `https://apps.apple.com/app/id${iosAppId}`;
  }
  return 'https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot';
};
