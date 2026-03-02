/**
 * 임시 코드를 서버에서 토큰으로 교환하는 API
 * OAuth 로그인 후 받은 일회용 코드를 액세스/리프레시 토큰으로 교환합니다.
 */

const serverUrl = import.meta.env.VITE_SERVER_URL;

/**
 * 임시 코드를 액세스 토큰과 리프레시 토큰으로 교환
 * @param {string} code - 임시 인증 코드
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 * @throws {Error} 코드가 유효하지 않거나 만료된 경우
 */
export const exchangeCodeForTokens = async code => {
  try {
    if (!code) {
      throw new Error('인증 코드가 없습니다.');
    }

    const response = await fetch(
      `${serverUrl}/authenticate/oauth/token-exchange`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        // 타임아웃 10초
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || '토큰 교환에 실패했습니다. 다시 로그인해주세요.'
      );
    }

    const data = await response.json();

    if (!data.success || !data.data?.accessToken || !data.data?.refreshToken) {
      throw new Error('잘못된 서버 응답입니다.');
    }

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  } catch (error) {
    // 네트워크 에러나 타임아웃
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('네트워크 연결이 불안정합니다. 다시 시도해주세요.');
    }

    // 기타 에러
    console.error('Token exchange error:', error);
    throw error;
  }
};
