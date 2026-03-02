import { makeApiRequest, createCancelToken } from './api.jsx';

/**
 * User API
 * - 공통 함수 사용으로 중복 코드 제거
 * - 기능은 100% 동일하게 유지
 */
export const userApi = {
  /**
   * 사용자 정보 수정
   */
  modify: async form => {
    const result = await makeApiRequest(
      'put',
      '/user/profile',
      { ...form },
      null,
      'userApi.modify'
    );

    // 기존과 동일하게 res.data.data 반환
    return {
      response: result.response?.data,
      cleanup: result.cleanup,
    };
  },

  /**
   * 회원 탈퇴
   */
  withdraw: async () => {
    const result = await makeApiRequest(
      'delete',
      '/user/account',
      undefined,
      null,
      'userApi.withdraw'
    );

    // 기존과 동일: status 204 체크
    if (result.status === 204) {
      return { response: result.status, cleanup: result.cleanup };
    }
    return { response: null, cleanup: result.cleanup };
  },

  /**
   * 사용자 정보 조회 (CancelToken 사용)
   */
  get: async (cancelToken = null) => {
    const result = await makeApiRequest(
      'get',
      '/user/profile',
      null,
      cancelToken,
      'userApi.get'
    );

    // 기존과 동일: status 체크 및 res.data.data 반환
    if (result.status >= 200 && result.status < 300) {
      return {
        response: result.response?.data,
        cleanup: result.cleanup,
      };
    }
    return { response: null, cleanup: result.cleanup };
  },

  /**
   * 사용자 정보 조회 (서브용, CancelToken 없음)
   */
  getForSub: async () => {
    const result = await makeApiRequest(
      'get',
      '/user/profile',
      null,
      null,
      'userApi.getForSub'
    );

    // 기존과 동일: status 체크 및 res.data.data 반환
    if (result.status >= 200 && result.status < 300) {
      return {
        response: result.response?.data,
        cleanup: result.cleanup,
      };
    }
    return { response: null, cleanup: result.cleanup };
  },
};
