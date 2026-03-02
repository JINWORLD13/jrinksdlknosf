import i18n from '../../locales/i18n.js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export async function shareLine({ text, url, t }) {
  try {
    const currentLang = (i18n?.language || 'en').slice(0, 2);
    const hl = ['en', 'ko', 'ja'].includes(currentLang) ? currentLang : 'en';
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const defaultUrl = `${baseUrl}/${hl}`;
    const shareUrl = url || defaultUrl;

    const inviteUrlLabel = t?.('share.invite_url_label') || 'Invitation Link:';
    const payloadText = `${text}\n\n${inviteUrlLabel}\n${shareUrl}`;
    const encoded = encodeURIComponent(payloadText);

    // 1) Try app deeplink first
    const deeplink = `line://msg/text/${encoded}`;

    // 2) Store fallbacks
    const platform = Capacitor?.getPlatform?.();
    const isNative = Capacitor?.isNativePlatform?.();
    const androidStore = 'market://details?id=jp.naver.line.android';
    const androidStoreWeb =
      'https://play.google.com/store/apps/details?id=jp.naver.line.android';
    const iosStore = 'https://apps.apple.com/app/id443904275'; // LINE iOS App ID

    if (isNative) {
      // In native, try opening deeplink; on failure, open store
      try {
        // Use window.location.href for native apps to open external apps directly
        window.location.href = deeplink;
        return true;
      } catch (_) {
        try {
          const storeUrl = platform === 'android' ? androidStore : iosStore;
          window.location.href = storeUrl;
          return true;
        } catch (_) {}
      }
      return false;
    }

    // Web browsers: try deeplink, then after a short delay, go to store web page
    if (typeof window !== 'undefined') {
      const now = Date.now();
      // Attempt to open the app
      const win = window.open(deeplink, '_blank');
      if (!win) {
        window.location.href = deeplink; // fallback if popup blocked
      }
      // After a delay, if user stayed, redirect to store webpage
      setTimeout(() => {
        // Heuristic: if tab likely still here, navigate to store web URL
        try {
          const storeWebUrl = androidStoreWeb; // LINE is primarily Android on web; iOS users usually in Safari where deeplink either works or shows prompt
          if (document.visibilityState !== 'hidden') {
            window.location.href = storeWebUrl;
          }
        } catch (_) {}
      }, 800);
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
}
