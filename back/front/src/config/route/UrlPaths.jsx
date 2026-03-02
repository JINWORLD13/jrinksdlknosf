import { ROUTE_ENV } from '../routeEnv.js';

// ROUTE_ENV[인덱스] → export 이름 유추 불가 (P0~P23)
export const P0 = ROUTE_ENV[0];
export const P1 = ROUTE_ENV[1];
export const P2 = ROUTE_ENV[2];
export const P3 = ROUTE_ENV[3];
export const P4 = ROUTE_ENV[4];
export const P5 = ROUTE_ENV[5];
export const P6 = ROUTE_ENV[6];
export const P7 = ROUTE_ENV[7];
export const P8 = ROUTE_ENV[8];
export const P9 = ROUTE_ENV[9];
export const P10 = ROUTE_ENV[10];
export const P11 = ROUTE_ENV[11];
export const P12 = ROUTE_ENV[12];
export const P13 = ROUTE_ENV[13];
export const P14 = ROUTE_ENV[14];
export const P15 = ROUTE_ENV[15];
export const P16 = ROUTE_ENV[16];
export const P17 = ROUTE_ENV[17];
export const P18 = ROUTE_ENV[18];
export const P19 = ROUTE_ENV[19];
export const P20 = ROUTE_ENV[20];
export const P21 = ROUTE_ENV[21];
export const P22 = ROUTE_ENV[22];
export const P23 = ROUTE_ENV[23];

/**
 * 언어 코드 + 경로 조각들을 이어서 절대 경로 문자열을 만듭니다.
 * 예: makePathWithLang('ko', 'mypage', 'chart') → '/ko/mypage/chart'
 * @param {string} lang - 언어 코드 (ko, ja, en 등)
 * @param {...string} pathParts - 경로 조각들 (빈 값은 자동 제외)
 * @returns {string} 맨 앞 슬래시로 시작하는 절대 경로 (끝 슬래시 제거)
 */
function makePathWithLang(lang, ...pathParts) {
  const path = pathParts.filter(Boolean).join('/');
  const full = `/${lang}${path ? `/${path}` : ''}`;
  return full.replace(/\/+$/, '');
}

/** lang 기준 절대 경로 객체. 키 P0~P23 (유추 불가) */
export const getPathWithLang = (lang) => ({
  P0: `/${lang}`,
  P1: makePathWithLang(lang, P1),
  P2: makePathWithLang(lang, P2),
  P3: makePathWithLang(lang, P3),
  P4: makePathWithLang(lang, P4),
  P5: makePathWithLang(lang, P5),
  P6: makePathWithLang(lang, P6),
  P7: makePathWithLang(lang, P7),
  P8: makePathWithLang(lang, P8),
  P9: makePathWithLang(lang, P9),
  P10: makePathWithLang(lang, P9, P10),
  P11: makePathWithLang(lang, P9, P11),
  P12: makePathWithLang(lang, P9, P12),
  P13: makePathWithLang(lang, P13),
  P14: makePathWithLang(lang, P13, P14),
  P15: makePathWithLang(lang, P13, P15),
  P16: makePathWithLang(lang, P13, P15, P16),
  P17: makePathWithLang(lang, P13, P15, P17),
  P18: makePathWithLang(lang, P13, P15, P18),
  P19: makePathWithLang(lang, P13, P19),
  P20: makePathWithLang(lang, P20),
  P21: makePathWithLang(lang, P21),
  P22: makePathWithLang(lang, P22),
});
