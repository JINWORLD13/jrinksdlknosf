import i18n from '../../locales/i18n.js';

export async function copyInviteLink({ text, url, t }) {
  try {
    const currentLang = (i18n?.language || 'en').slice(0, 2);
    const hl = ['en', 'ko', 'ja'].includes(currentLang) ? currentLang : 'en';
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const defaultUrl = `${baseUrl}/${hl}`;
    const shareUrl = url || defaultUrl;

    const inviteUrlLabel = t?.('share.invite_url_label') || 'Invitation Link:';
    const payload = `${text}\n\n${inviteUrlLabel}\n${shareUrl}`;

    await navigator?.clipboard?.writeText?.(payload);
    return true;
  } catch (_) {
    return false;
  }
}
