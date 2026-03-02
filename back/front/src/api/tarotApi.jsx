import { makeApiRequest, createCancelToken } from './api.jsx';

/**
 * Tarot API
 * - 공통 함수 사용으로 중복 코드 제거
 * - 기능은 100% 동일하게 유지
 */
export const tarotApi = {
  /**
   * 타로 히스토리 조회 (CancelToken 사용)
   */
  getHistory: async (cancelToken = null) => {
    const result = await makeApiRequest(
      'get',
      '/tarot/readings',
      null,
      cancelToken,
      'tarotApi.getHistory'
    );

    // 기존과 동일하게 res.data 반환
    return {
      response: result.response,
      cleanup: result.cleanup,
    };
  },

  /**
   * 타로 히스토리 조회 (서브용, CancelToken 없음)
   */
  getHistoryForSub: async () => {
    const result = await makeApiRequest(
      'get',
      '/tarot/readings',
      null,
      null,
      'tarotApi.getHistoryForSub'
    );

    return {
      response: result.response,
      cleanup: result.cleanup,
    };
  },

  /**
   * 폴링 헬퍼 함수
   */
  pollJobStatus: async (jobId, cleanupFunc) => {
    const pollInterval = 3000; // 3초
    const maxAttempts = 100; // 5분 (3s * 100)

    for (let i = 0; i < maxAttempts; i++) {
      // 잠시 대기
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const result = await makeApiRequest(
        'get',
        `/tarot/status/${jobId}`,
        null,
        null,
        'tarotApi.pollJobStatus'
      );

      if (result?.isCanceled) {
        return {
          response: null,
          cleanup: cleanupFunc || result.cleanup,
          isCanceled: true,
        };
      }

      // 성공(Completed) 확인
      if (result.response && result.response.state === 'completed') {
        // 결과 반환 (기존 API 응답 포맷과 맞춤)
        return {
          response: result.response.result, // 실제 타로 결과
          cleanup: cleanupFunc || result.cleanup,
          isCanceled: false,
        };
      }

      // 실패(Failed) 확인
      if (result.response && result.response.state === 'failed') {
        throw new Error(
          result.response.error || 'Job failed during processing'
        );
      }

      // 대기중(waiting/active/delayed)이면 루프 계속
    }
    throw new Error('Timeout waiting for tarot generation');
  },

  /**
   * 타로 질문 전송 (구매용)
   */
  postQuestionForPurchase: async form => {
    const result = await makeApiRequest(
      'post',
      '/tarot/question',
      { ...form },
      null,
      'tarotApi.postQuestionForPurchase'
    );

    return {
      response: result.response,
      cleanup: result.cleanup,
    };
  },

  /**
   * 타로 질문 전송 (광고용)
   */
  postQuestionForAds: async form => {
    const result = await makeApiRequest(
      'post',
      '/tarot/question/ads',
      { ...form },
      null,
      'tarotApi.postQuestionForAds'
    );

    return {
      response: result.response,
      cleanup: result.cleanup,
    };
  },

  /**
   * 타로 질문 전송 (일반 모드)
   */
  postQuestionForNormalForAnthropicAPI: async form => {
    const result = await makeApiRequest(
      'post',
      '/tarot/readings/normal',
      { ...form, useQueue: true },
      null,
      'tarotApi.postQuestionForNormal'
    );

    if (result?.isCanceled) {
      return {
        response: null,
        cleanup: result.cleanup,
        isCanceled: true,
      };
    }

    // 큐 대기 상태(202)인 경우 폴링 시작
    if (result.status === 202 && result.response?.jobId) {
      const polledResult = await tarotApi.pollJobStatus(
        result.response.jobId,
        result.cleanup
      );
      return {
        ...polledResult,
        isCanceled: polledResult?.isCanceled ?? false,
      };
    }

    return {
      response: result.response,
      cleanup: result.cleanup,
      isCanceled: false,
    };
  },

  /**
   * 타로 질문 전송 (심층 모드)
   */
  postQuestionForDeepForAnthropicAPI: async form => {
    const result = await makeApiRequest(
      'post',
      '/tarot/readings/deep',
      { ...form, useQueue: true },
      null,
      'tarotApi.postQuestionForDeep'
    );

    if (result?.isCanceled) {
      return {
        response: null,
        cleanup: result.cleanup,
        isCanceled: true,
      };
    }

    // 큐 대기 상태(202)인 경우 폴링 시작
    if (result.status === 202 && result.response?.jobId) {
      const polledResult = await tarotApi.pollJobStatus(
        result.response.jobId,
        result.cleanup
      );
      return {
        ...polledResult,
        isCanceled: polledResult?.isCanceled ?? false,
      };
    }

    return {
      response: result.response,
      cleanup: result.cleanup,
      isCanceled: false,
    };
  },

  /**
   * 타로 질문 전송 (진지 모드)
   */
  postQuestionForSeriousForAnthropicAPI: async form => {
    const result = await makeApiRequest(
      'post',
      '/tarot/readings/serious',
      { ...form, useQueue: true },
      null,
      'tarotApi.postQuestionForSerious'
    );

    if (result?.isCanceled) {
      return {
        response: null,
        cleanup: result.cleanup,
        isCanceled: true,
      };
    }

    // 큐 대기 상태(202)인 경우 폴링 시작
    if (result.status === 202 && result.response?.jobId) {
      const polledResult = await tarotApi.pollJobStatus(
        result.response.jobId,
        result.cleanup
      );
      return {
        ...polledResult,
        isCanceled: polledResult?.isCanceled ?? false,
      };
    }

    return {
      response: result.response,
      cleanup: result.cleanup,
      isCanceled: false,
    };
  },

  /**
   * 타로 히스토리 삭제 (개별)
   */
  deleteHistory: async tarotHistoryData => {
    const result = await makeApiRequest(
      'delete',
      '/tarot/readings',
      { tarotHistoryData },
      null,
      'tarotApi.deleteHistory'
    );

    // 기존과 동일: status 204일 때 'success' 반환
    if (result.status === 204) {
      return { response: 'success', cleanup: result.cleanup };
    }
    return { response: null, cleanup: result.cleanup };
  },

  /**
   * 타로 히스토리 전체 삭제 (언어별)
   */
  deleteAllHistoryByLanguage: async language => {
    const result = await makeApiRequest(
      'delete',
      '/tarot/readings',
      { isDeleteAll: true, language },
      null,
      'tarotApi.deleteAllHistoryByLanguage'
    );

    // 기존과 동일: status 204일 때 'success' 반환
    if (result.status === 204) {
      return { response: 'success', cleanup: result.cleanup };
    }
    return { response: null, cleanup: result.cleanup };
  },

  /**
   * 타로 히스토리 전체 삭제 (모든 언어) - 사용하지 않는 레거시
   */
  deleteAllHistory: async () => {
    const result = await makeApiRequest(
      'delete',
      '/tarot/readings',
      null,
      null,
      'tarotApi.deleteAllHistory'
    );

    // 기존과 동일: status 204일 때 'success' 반환
    if (result.status === 204) {
      return { response: 'success', cleanup: result.cleanup };
    }
    return { response: null, cleanup: result.cleanup };
  },
};


