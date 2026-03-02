export function buildReferralLink({ originOverride, userId, lang }) {
  try {
    const origin =
      originOverride ||
      import.meta.env.VITE_SERVER_URL;
    const safeLang = lang || 'ko';
    const url = new URL(`${origin}/${safeLang}`);
    if (userId) url.searchParams.set('ref', userId);
    url.searchParams.set('utm_source', 'referral');
    url.searchParams.set('utm_medium', 'share');
    url.searchParams.set('utm_campaign', 'friend-invite');
    return url.toString();
  } catch {
    return '';
  }
}
