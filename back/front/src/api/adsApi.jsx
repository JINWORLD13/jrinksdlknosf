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

export const adsApi = {
  //! 취소 토큰 사용안함.
  postAdMobReward: async form => {
    const accessToken = await getAccessToken2();
    const refreshToken = await getRefreshToken2();
    const { apiWithTokens, cleanup } = await apiWithTokensModule(accessToken);

    try {
      const res = await apiWithTokens.post('/tarot/question', { ...form });
      return { response: res.data, cleanup }; // cleanup 함수를 함께 반환
    } catch (error) {
      console.error(error);
      if (!axios.isCancel(error)) {
        //~ 여기는 제어가 되는 부분.
        if (
          window.confirm('Network error occurred. Please connect internet.')
        ) {
          window.location.reload();
        } else {
          if (error?.response) {
            console.error('SSV verification failed:', error?.response?.data);
          } else if (error?.request) {
            console.error('No response received:', error?.request);
          } else {
            console.error('Error setting up the request:', error?.message);
          }
          console.error('SSV verification failed');
        }
      } else {
        //~ 여기는 제어가 되지 않는 부분.
        //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
        console.error('postQuestionForPurchase Error:', error);
      }
      return { data: null, cleanup }; // 에러 발생 시에도 cleanup 반환
    }
  },
};

