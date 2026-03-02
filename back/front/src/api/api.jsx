import axios from 'axios';
import {
  setAccessToken,
  getAccessToken,
  removeAccessTokens,
  removeRefreshTokens,
} from '../utils/storage/tokenCookie.jsx';
import { Capacitor } from '@capacitor/core';
import {
  getAccessTokenForPreference,
  getRefreshTokenForPreference,
  setAccessTokenForPreference,
  removeAccessTokensForPreference,
  removeRefreshTokensForPreference,
} from '../utils/storage/tokenPreference.jsx';

const isNative = Capacitor.isNativePlatform();
const serverUrl = import.meta.env.VITE_SERVER_URL;

// 요청별 CancelToken 생성 (전역 source 대신)
// リクエストごとにCancelToken生成（グローバルsourceの代わりに）
// Create CancelToken per request (instead of global source)
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * 토큰 가져오기 헬퍼 (웹/앱 환경 자동 처리)
 * - 리프레쉬 토큰은 httpOnly 쿠키로 서버에서 자동으로 관리됨
 */
export const getAccessToken2 = async () => {
  if (isNative) {
    return await getAccessTokenForPreference();
  } else {
    return getAccessToken();
  }
};

// 액세스 토큰 저장 헬퍼 (웹/네이티브 환경 구분)
// アクセストークン保存ヘルパー（Web/ネイティブ環境を区別）
// Access token setter helper (web/native environment)
export const setAccessToken2 = async token => {
  if (isNative) {
    await setAccessTokenForPreference(token);
  } else {
    setAccessToken(token);
  }
};

/**
 * 토큰 삭제 헬퍼 (웹/앱 환경 자동 처리)
 */
export const clearTokens2 = async () => {
  if (isNative) {
    await removeAccessTokensForPreference();
    await removeRefreshTokensForPreference();
  } else {
    removeAccessTokens();
    removeRefreshTokens();
  }
};

// Axios 인터셉터 - 토큰 자동 갱신 (401 시 리프레시 후 재시도)
// Axiosインターセプター - トークン自動更新（401時リフレッシュ後に再試行）
// Axios interceptor - auto token refresh (retry after refresh on 401)
const setupInterceptors = api => {
  let isRefreshing = false; // 토큰 갱신 중복 방지
  let failedQueue = []; // 대기 중인 요청들

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  const responseInterceptorId = api.interceptors.response.use(
    async response => {
      // 응답에 새 액세스 토큰이 포함된 경우 (checkTokenWithRefresh 미들웨어에서)
      const newAccessToken =
        response?.data?.data?.newAccessToken ??
        response?.data?.newAccessToken ??
        null;
      if (newAccessToken !== null && !response.config._retry) {
        await setAccessToken2(newAccessToken);
        response.config.headers.Authorization = `Bearer ${newAccessToken}`;
        response.config._retry = true;
        return api(response.config);
      }
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // 401 에러 && 아직 재시도하지 않은 요청
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 갱신 중이면 대기
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // /authenticate/refresh 엔드포인트로 토큰 갱신
          const refreshHeaders = { withCredentials: true };

          // 네이티브 앱: 리프레쉬 토큰을 헤더로 전송
          if (isNative) {
            const refreshToken = await getRefreshTokenForPreference();
            if (refreshToken) {
              refreshHeaders.headers = { 'Refresh-Token': refreshToken };
            }
          }

          const refreshResponse = await axios.post(
            `${serverUrl}/authenticate/refresh`,
            {},
            refreshHeaders,
          );

          const newAccessToken = refreshResponse.data?.data?.newAccessToken;

          if (newAccessToken) {
            await setAccessToken2(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return api(originalRequest);
          } else {
            throw new Error('No access token received');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          await clearTokens2();
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 403 에러 또는 갱신 불가능한 401 에러
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes('로그인') || errorMessage.includes('login')) {
          await clearTokens2();
          window.location.href = '/';
        }
      }

      return Promise.reject(error);
    },
  );

  // cleanup 함수 반환
  return () => {
    api.interceptors.response.eject(responseInterceptorId);
  };
};

/**
 * 기본 API 클라이언트 (토큰 없음)
 */
export const apiModule = () => {
  const api = axios.create({
    baseURL: serverUrl,
    withCredentials: true, // 쿠키 자동 전송 (httpOnly 리프레쉬 토큰)
    responseType: 'json', // JSON 응답 명시 (브라우저는 자동으로 UTF-8 사용)
    headers: {
      'content-type': 'application/json; charset=utf-8',
      accept: 'application/json; charset=utf-8',
      'X-Client-Type': 'web',
    },
    timeout: 210000, // 3.5분 타임아웃
  });

  return { api };
};

/**
 * 토큰 포함 API 클라이언트
 * - 웹: refreshToken은 httpOnly 쿠키로 자동 전송됨
 * - 앱: refreshToken을 헤더로 전송
 */
export const apiWithTokensModule = async accessToken => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    Authorization: `Bearer ${accessToken}`,
    accept: 'application/json; charset=utf-8',
    'X-Client-Type': 'web',
  };

  // 네이티브 앱: 리프레쉬 토큰을 헤더로 전송
  if (isNative) {
    const refreshToken = await getRefreshTokenForPreference();
    if (refreshToken) {
      headers['Refresh-Token'] = refreshToken;
    }
  }

  const apiWithTokens = axios.create({
    baseURL: serverUrl,
    withCredentials: true, // 쿠키 자동 전송 (웹용)
    responseType: 'json', // JSON 응답 명시 (브라우저는 자동으로 UTF-8 사용)
    headers,
    timeout: 210000, // 3.5분 타임아웃
  });

  const cleanup = setupInterceptors(apiWithTokens);

  return { apiWithTokens, cleanup };
};

/**
 * 에러 핸들링 유틸리티
 * - Cancel 에러는 무시
 * - 네트워크 에러는 사용자에게 알림
 */
export const handleApiError = (error, apiName = 'API') => {
  if (axios.isCancel(error)) {
    console.error(`${apiName} Error (Cancelled):`, error.message);
    return;
  }

  console.error(`${apiName} Error:`, error);

  // 커스텀 에러 메시지가 있으면 그것을 표시 (예: 초대 제한 초과 등)
  const customMessage = error.response?.data?.message;
  if (customMessage && error.response?.status === 400) {
    if (window.confirm(customMessage)) {
      window.location.reload();
    }
    return;
  }

  if (window.confirm('Network error occurred. Please connect internet.')) {
    window.location.reload();
  }
};

/**
 * 공통 API 요청 래퍼
 * - 중복 코드 제거
 * - 토큰 자동 처리
 * - 에러 핸들링 자동 처리
 * - 웹: 리프레쉬 토큰은 httpOnly 쿠키로 자동 전송됨
 * - 앱: 리프레쉬 토큰은 헤더로 전송됨
 */
export const makeApiRequest = async (
  method,
  url,
  data = null,
  cancelToken = null,
  apiName = 'API',
) => {
  const accessToken = await getAccessToken2();
  const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);

  try {
    let response;
    const config = cancelToken ? { cancelToken } : {};

    switch (method.toLowerCase()) {
      case 'get':
        response = await apiWithTokens.get(url, config);
        break;
      case 'post':
        response = await apiWithTokens.post(url, data, config);
        break;
      case 'put':
        response = await apiWithTokens.put(url, data, config);
        break;
      case 'delete':
        // DELETE 요청에서 data가 null이나 undefined면 body를 포함하지 않음
        const deleteConfig =
          data !== null && data !== undefined ? { ...config, data } : config;
        response = await apiWithTokens.delete(url, deleteConfig);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return { response: response.data, cleanup, status: response.status };
  } catch (error) {
    const isCanceled = axios.isCancel(error);
    handleApiError(error, apiName);
    return { response: null, cleanup, status: null, isCanceled };
  }
};

//   api,
//   error,




//   // ! data 하나만 들어가나?

//   return { api, cleanupForWithTokens }; // then의 response가 될 부분.
// };
