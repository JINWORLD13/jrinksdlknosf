import Cookies from 'js-cookie';

export const setAccessToken = accessTokenKey => {
  // path : 설정한 경로 및 하위 경로에서만 해당 쿠키가 적용
  // expires : 쿠키 저장 기간 (JWT 토큰 유효기간과는 별개)
  // 액세스 토큰 쿠키는 15초로 설정 (JWT 토큰 만료와 동일)
  if (accessTokenKey !== null && accessTokenKey !== undefined) {
    const isProduction = import.meta.env.PROD;
    Cookies.set('accessTokenCosmos', accessTokenKey, {
      expires: 14,
      secure: isProduction, // HTTPS에서만 전송
      sameSite: 'lax', // 서버와 동일하게 lax 설정 (strict는 서버 설정과 불일치)
    });
  }
};

export const getAccessToken = () => {
  const keyValue = Cookies.get('accessTokenCosmos') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result; // null 아니면 value 반환
};

// 리프레쉬 토큰은 httpOnly 쿠키로 JavaScript에서 접근 불가
// 하지만 다른 파일에서 import하므로 null을 반환하는 함수 export
export const getRefreshToken = () => {
  // httpOnly 쿠키는 JavaScript에서 접근 불가능
  // 서버에서 자동으로 처리됨
  return null;
};

// HttpOnly가 설정된건 불러오지도 삭제하지도 못함.(XSS공격 방지. js로 접근 못함. F12 열어서 맘대로 적어서 안됨.)
// 쿠키스토리지에 accessToken이란 키값을 설정하여 값에 아무거나 넣었더니(XSS 공격) 같은 효력을 내므로 이건 무용지물. 서버에서 체크하는게 맞다.
// 단, 토큰이 있으면 못들어가게 막는건 가능. 들어가게 하는건 다른 문제(서버로 창을 바꾼후 서버에서 검증하여 redirect 시키는 수밖에.).
export const hasAccessToken = () => {
  const accessToken = getAccessToken();

  if (accessToken === undefined) {
    return false;
  } else {
    return accessToken !== null; // 유효한 token이 있으면 true, 토큰 자체가 없으면 false
  }
};

export const setGoogleAccessToken = accessTokenKey => {
  // path : 설정한 경로 및 하위 경로에서만 해당 쿠키가 적용
  if (accessTokenKey !== null && accessTokenKey !== undefined) {
    const isProduction = import.meta.env.PROD;
    Cookies.set('gAccessTokenCosmos', accessTokenKey, {
      expires: 14, // 백엔드 maxAge와 동일 (14일)
      secure: isProduction, // HTTPS에서만 전송
      sameSite: 'lax', // 서버와 동일하게 설정
    });
  }
};

// Google 리프레쉬 토큰은 httpOnly 쿠키로 서버에서 관리됨 (프론트에서 설정 불필요)
export const setGoogleRefreshToken = refreshTokenKey => {
  if (refreshTokenKey !== null && refreshTokenKey !== undefined) {
    const isProduction = import.meta.env.PROD;
    Cookies.set('gRefreshTokenCosmos', refreshTokenKey, {
      expires: 23, // 백엔드 maxAge와 동일 (23일)
      secure: isProduction, // HTTPS에서만 전송
      sameSite: 'lax', // 서버와 동일하게 설정
    });
  }
};

export const getGoogleAccessToken = () => {
  const keyValue = Cookies.get('gAccessTokenCosmos') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result; // null 아니면 value 반환
};

export const getGoogleRefreshToken = () => {
  const keyValue = Cookies.get('gRefreshTokenCosmos') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result;
};

export const hasGoogleAccessToken = () => {
  const gAccessToken = getGoogleAccessToken();

  if (gAccessToken === undefined) {
    return false;
  } else {
    return gAccessToken !== null;
  }
};

export const hasGoogleRefreshToken = () => {
  const gRefreshToken = getGoogleRefreshToken();
  if (gRefreshToken === undefined) {
    return false;
  } else {
    return gRefreshToken !== null;
  }
};

export const removeAccessTokens = () => {
  Cookies.remove('accessTokenCosmos');
  Cookies.remove('gAccessTokenCosmos');
};

export const removeRefreshTokens = () => {
  Cookies.remove('refreshTokenCosmos');
  Cookies.remove('gRefreshTokenCosmos');
};
