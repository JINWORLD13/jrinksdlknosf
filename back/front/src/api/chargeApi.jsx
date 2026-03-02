import { Capacitor } from '@capacitor/core';
import {
  getAccessToken,
  getRefreshToken,
} from '../utils/storage/tokenCookie.jsx';
import {
  getAccessTokenForPreference,
  getRefreshTokenForPreference,
} from '../utils/storage/tokenPreference.jsx';
const isNative = Capacitor.isNativePlatform();
const getAccessToken2 = async () => {
  if (isNative) {
    return await getAccessTokenForPreference();
  } else {
    return getAccessToken();
  }
};

const getRefreshToken2 = async () => {
  if (isNative) {
    return await getRefreshTokenForPreference();
  } else {
    return getRefreshToken();
  }
};

import { apiWithTokensModule } from './api.jsx';
import axios from 'axios';

export const chargeApi = {
  //! 취소 토큰 사용안함.
  postPrePaymentForToss: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.post('/payments/toss/prepare', {
        ...form,
      });
      return { response: res.data, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
          // 에러 응답 메시지 확인
          if (error.response?.data) {
            console.error('Error response data:', error.response.data);
            console.error('Error message:', error.response.data.message);
          }
        }
        if (
          window.confirm(
            `Network error occurred. Failed to post PrePaymentForToss.\n\nError: ${
              error.response?.data?.message || error.message
            }\n\n페이지를 새로고침하시겠습니까?`,
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error(
              'postPrePaymentForToss Error:',
              JSON.stringify(error),
            );
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error('postPrePaymentForToss Error:', JSON.stringify(error));
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  getPrePaymentForToss: async () => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.get('/payments/toss/prepare');
      return { response: res.data.charge, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to get PrePaymentForToss.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error('getPrePaymentForToss Error:', JSON.stringify(error));
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error('getPrePaymentForToss Error:', JSON.stringify(error));
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  getPrePaymentForTossByOrderId: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.get(
        `/payments/toss/prepare?orderId=${form?.orderId}`,
      );
      return { response: res.data.charge, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to get PrePaymentForTossByOrderId.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error(
              'getPrePaymentForTossByOrderId Error:',
              JSON.stringify(error),
            );
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error(
            'getPrePaymentForTossByOrderId Error:',
            JSON.stringify(error),
          );
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  deletePrePaymentForTossByOrderId: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.delete('/payments/toss/prepare', {
        data: { orderId: form?.orderId },
      });
      return { response: res.data, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to delete PrePaymentForTossByOrderId.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error(
              'deletePrePaymentForTossByOrderId Error:',
              JSON.stringify(error),
            );
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error(
            'deletePrePaymentForTossByOrderId Error:',
            JSON.stringify(error),
          );
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  // "not yet"인거 없애기
  deletePrePaymentForTossByPaymentKey: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.delete('/payments/toss/prepare/by-key', {
        data: { paymentKey: form?.paymentKey },
      });
      return { response: res.data, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to delete PrePaymentForTossByPaymentKey.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error(
              'deletePrePaymentForTossByPaymentKey Error:',
              JSON.stringify(error),
            );
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error(
            'deletePrePaymentForTossByPaymentKey Error:',
            JSON.stringify(error),
          );
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  putPrePaymentForToss: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.put('/payments/toss/prepare', {
        ...form,
      });
      return { response: res.data, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to put PrePaymentForToss.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error('putPrePaymentForToss Error:', JSON.stringify(error));
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error('putPrePaymentForToss Error:', JSON.stringify(error));
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  postPaymentForToss: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.post('/payments/toss/confirm', {
        ...form,
      });
      return { response: res, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to post PaymentForToss.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error('postPaymentForToss Error:', JSON.stringify(error));
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error('postPaymentForToss Error:', JSON.stringify(error));
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  postPartialCancelForToss: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.post('/payments/toss/refund', {
        ...form,
      });
      return { response: res, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
        }
        if (
          window.confirm(
            'Network error occurred. Failed to post PartialCancelForToss.',
          )
        ) {
          window.location.reload();
        } else {
          if (import.meta.env.DEV) {
            console.error(
              'postPartialCancelForToss Error:',
              JSON.stringify(error),
            );
          }
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error(
            'postPartialCancelForToss Error:',
            JSON.stringify(error),
          );
        }
      }
      return { response: null, cleanup };
    }
  },

  //! 취소 토큰 사용안함.
  postPaymentForGooglePlayStore: async form => {
    if (import.meta.env.DEV) {
      console.log('[postPaymentForGooglePlayStore] Started');
    }
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();

    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);

    try {
      const res = await apiWithTokens.post('/payments/mobile/verify', form);

      if (import.meta.env.DEV) {
        console.log('[postPaymentForGooglePlayStore] Success:', res.data);
      }

      return { response: res.data, cleanup };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[postPaymentForGooglePlayStore] Error');
        console.error(
          '[postPaymentForGooglePlayStore] error.message:',
          error?.message,
        );
        console.error(
          '[postPaymentForGooglePlayStore] error.response:',
          error?.response?.data,
        );
        console.error(
          '[postPaymentForGooglePlayStore] error.response.data.message:',
          error?.response?.data?.message,
        );
        console.error(
          '[postPaymentForGooglePlayStore] error.response.status:',
          error?.response?.status,
        );
        console.error(
          '[postPaymentForGooglePlayStore] error.request:',
          error?.request ? 'Exists' : 'None',
        );
        console.error(
          '[postPaymentForGooglePlayStore] error.stack:',
          error?.stack,
        );
      }

      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        // 에러를 throw하여 상위에서 처리할 수 있도록 함
        // cleanup은 호출하지 않고 에러를 전파
        throw error;
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        if (import.meta.env.DEV) {
          console.error(
            '[postPaymentForGooglePlayStore] Cancelled request:',
            JSON.stringify(error),
          );
        }
        // 취소된 요청의 경우 null 반환
        return { response: null, cleanup, error };
      }
    }
  },

  //! nodejs서버에서 어떤 구매항목에 대한 설정을 할것인가를 넣어야 함.
  getPurchaseLimit: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.get(
        `/payments/purchase-limit?productId=${form?.productId}`,
      );
      return { response: res.data.purchaseLimit, cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        console.error('Error:', JSON.stringify(error));
        if (
          window.confirm('Network error occurred. Failed to get PurchaseLimit.')
        ) {
          window.location.reload();
        } else {
          console.error('getPurchaseLimit Error:', JSON.stringify(error));
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        console.error('getPurchaseLimit Error:', JSON.stringify(error));
      }
      return { response: null, cleanup };
    }
  },

  // 초심자 패키지 orderId 조회
  getBeginnerPackageOrderIds: async () => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);
    try {
      const res = await apiWithTokens.get(
        '/payments/beginner-package-order-ids',
      );
      // buildResponse 구조: { data, errorName, errorMessage, statusCode }
      return { response: res.data?.data || [], cleanup };
    } catch (error) {
      if (!axios.isCancel(error)) {
        if (import.meta.env.DEV) {
          console.error('Error:', JSON.stringify(error));
          console.error(
            'getBeginnerPackageOrderIds Error:',
            JSON.stringify(error),
          );
        }
      } else {
        if (import.meta.env.DEV) {
          console.error(
            'getBeginnerPackageOrderIds Error:',
            JSON.stringify(error),
          );
        }
      }
      return { response: [], cleanup };
    }
  },
};





