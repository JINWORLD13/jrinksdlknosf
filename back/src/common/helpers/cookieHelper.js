/**
 * 쿠키 설정 헬퍼 함수
 * - 리프레쉬 토큰은 httpOnly로 설정하여 XSS 공격 방어
 * - 액세스 토큰은 일반 쿠키로 설정하여 프론트에서 읽을 수 있도록 함
 */

const accessTokenMaxAge = 14 * 24 * 60 * 60 * 1000; // 14일을 밀리초 단위로 계산
const refreshTokenMaxAge = 23 * 24 * 60 * 60 * 1000; // 23일을 밀리초 단위로 계산

/**
 * 리프레쉬 토큰을 httpOnly 쿠키로 설정
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  res.cookie("refreshTokenCosmos", refreshToken, {
    maxAge: refreshTokenMaxAge,
    httpOnly: true, // JavaScript로 접근 불가 (XSS 방어)
    secure: isProduction, // HTTPS에서만 전송 (프로덕션)
    sameSite: "lax", // CSRF 방어 (OAuth 호환성 위해 lax 권장)
  });
};

/**
 * Google 리프레쉬 토큰을 httpOnly 쿠키로 설정
 */
const setGoogleRefreshTokenCookie = (res, googleRefreshToken) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  res.cookie("gRefreshTokenCosmos", googleRefreshToken, {
    maxAge: refreshTokenMaxAge,
    httpOnly: true, // JavaScript로 접근 불가
    secure: isProduction,
    sameSite: "lax", // OAuth 호환성 위해 lax
  });
};

/**
 * 액세스 토큰을 일반 쿠키로 설정 (프론트에서 읽을 수 있음)
 */
const setAccessTokenCookie = (res, accessToken) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  res.cookie("accessTokenCosmos", accessToken, {
    maxAge: accessTokenMaxAge,
    httpOnly: false, // JavaScript로 접근 가능
    secure: isProduction,
    sameSite: "lax",
  });
};

/**
 * Google 액세스 토큰을 일반 쿠키로 설정
 */
const setGoogleAccessTokenCookie = (res, googleAccessToken) => {
  const isProduction = process.env.NODE_ENV === "PRODUCTION";

  res.cookie("gAccessTokenCosmos", googleAccessToken, {
    maxAge: accessTokenMaxAge,
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
  });
};

/**
 * 모든 쿠키 삭제 (로그아웃 시)
 */
const clearAllCookies = (res) => {
  res.clearCookie("gAccessTokenCosmos");
  res.clearCookie("gRefreshTokenCosmos");
  res.clearCookie("accessTokenCosmos");
  res.clearCookie("refreshTokenCosmos");
};

module.exports = {
  setRefreshTokenCookie,
  setGoogleRefreshTokenCookie,
  setAccessTokenCookie,
  setGoogleAccessTokenCookie,
  clearAllCookies,
};
