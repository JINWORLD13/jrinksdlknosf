import { Capacitor } from '@capacitor/core';
import i18n from '../../locales/i18n.js';

export async function inviteShare({
  text,
  url,
  trackSocialShare,
  trackButtonClick,
  t,
}) {
  try {
    if (typeof trackButtonClick === 'function')
      trackButtonClick('share_invite');

    const isNative = Capacitor.isNativePlatform();

    const currentLang = (i18n?.language || 'en').slice(0, 2);
    const hl = ['en', 'ko', 'ja'].includes(currentLang) ? currentLang : 'en';
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const defaultUrl = `${baseUrl}/${hl}`;
    const shareUrl = url || defaultUrl;

    const inviteUrlLabel = t?.('share.invite_url_label') || 'Invitation Link:';
    const payload = `${text}\n\n${inviteUrlLabel}`;
    const title = t?.('share.invite_title') || 'Cosmos Tarot';

    if (isNative) {
      try {
        const mod = await import(/* @vite-ignore */ '@capacitor/share');
        if (mod?.Share?.share) {
          await mod.Share.share({
            title: title,
            text: payload,
            url: shareUrl,
            dialogTitle: title,
          });
          if (typeof trackSocialShare === 'function')
            trackSocialShare('capacitor_share', 'invite');
          return true;
        }
      } catch (_) {}
      // Fallback to web share then clipboard if Capacitor unavailable
    }

    if (
      !isNative &&
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      await navigator.share({
        title: title,
        text: payload,
        url: shareUrl,
      });
      if (typeof trackSocialShare === 'function')
        trackSocialShare('web_share', 'invite');
      return true;
    }

    // Clipboard fallback (web only). Do not copy or alert on native.
    if (
      !isNative &&
      typeof navigator !== 'undefined' &&
      navigator?.clipboard?.writeText
    ) {
      await navigator.clipboard.writeText(shareUrl);
      if (typeof trackSocialShare === 'function')
        trackSocialShare('clipboard', 'invite');
      return true;
    }

    return false;
  } catch (e) {
    // Swallow UI alerts here; caller should handle UX
    return false;
  }
}
