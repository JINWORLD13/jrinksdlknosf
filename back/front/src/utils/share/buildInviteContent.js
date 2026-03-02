/**
 * Builds invite content (title, text, notice, download info) for sharing
 * @param {Object} params
 * @param {Function} params.t - Translation function
 * @param {boolean} params.includeNotice - Whether to include invite notice
 * @param {boolean} params.includeDownload - Whether to include download link
 * @returns {Object} Content object with title, text, notice, etc.
 */
export function buildInviteContent({
  t,
  includeNotice = true,
  includeDownload = false,
}) {
  const inviteTitle = t('share.invite_title') || 'Cosmos Tarot';
  const inviteText =
    t('share.invite_text') ||
    "Check out feelings you're curious about on Cosmos Tarot!";
  const inviteNotice =
    t?.('share.invite_notice') ||
    'If the app is not installed, please install first, then revisit this link and sign in to receive rewards.';
  const inviteWebHint =
    t?.('share.invite_web_hint') ||
    'Sign in via the URL below to receive rewards.';

  const currentLang = (t?.i18n?.language || 'en').slice(0, 2);
  const hl = ['en', 'ko', 'ja'].includes(currentLang) ? currentLang : 'en';
  const downloadPrefix =
    t?.('share.download_prefix') ||
    (hl === 'ko'
      ? '앱이 없다면 여기에서 다운로드하세요:'
      : 'Download the app here:');
  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot&hl=${hl}`;

  let text = `${inviteTitle} - ${inviteText}`;
  if (includeNotice) {
    text += `\n\n${inviteNotice}`;
  }
  // When not including native-only notice, append a web-only hint line for clarity in browsers
  if (!includeNotice && inviteWebHint) {
    text += `\n\n${inviteWebHint}`;
  }
  if (includeDownload) {
    text += `\n\n${downloadPrefix} ${playStoreUrl}`;
  }

  return {
    inviteTitle,
    inviteText,
    inviteNotice,
    inviteWebHint,
    downloadPrefix,
    playStoreUrl,
    text,
    hl,
  };
}
