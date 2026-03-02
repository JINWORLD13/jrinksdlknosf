/**
 * 프론트 → 백엔드 API 라우트 prefix (env 기반). env 키는 경로 유추 불가.
 */
const e = import.meta.env;

export const API_ROUTES = {
  tarot: e.VITE_A01,
  auth: e.VITE_A02,
  user: e.VITE_A03,
  admin: e.VITE_A04,
  payments: e.VITE_A05,
  google: e.VITE_A06,
  version: e.VITE_A07,
  referral: e.VITE_A08,
};

/** API 경로인지 판별 (언어 리다이렉트 제외용). pathname은 / 로 시작하는 전체 path */
export function isApiPath(pathname) {
  const prefixes = Object.values(API_ROUTES).filter(Boolean);
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}
