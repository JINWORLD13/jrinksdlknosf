import { apiModule } from './api.jsx';
import axios from 'axios';

// 위에서 설정한 api에 method를 포함시켜서 간결하게 호출할 수 있게 된다.
export const authApi = {
  //! 취소 토큰 사용안함.
  logIn: async () => {
    const { api } = apiModule();
    return await api
      .get('/authenticate/oauth/google/start')
      .then(res => {
        return res?.data?.data;
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          //~ 여기는 제어가 되는 부분.
          console.error('Error:', error);
          if (window.confirm('Please try again. Failed to log in.')) {
            window.location.reload();
          } else {
            console.error('Login Error:', error);
            throw error;
          }
        } else {
          //~ 여기는 제어가 되지 않는 부분.
          //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
          console.error('Login Error:', error);
        }
      });
  },
  //! 취소 토큰 사용안함.
  logOut: async () => {
    const { api } = apiModule();
    return await api
      .get('/authenticate/oauth/google/logout')
      .then(res => {
        return res?.data?.data;
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          //~ 여기는 제어가 되는 부분.
          console.error('Error:', error);
          if (window.confirm('Please try again. Failed to log out.')) {
            window.location.reload();
          } else {
            console.error('Logout Error:', error);
            throw error;
          }
        } else {
          //~ 여기는 제어가 되지 않는 부분.
          //! 여기에 throw error나 alert, reload 넣지 않기... 작동안함.
          console.error('Logout Error:', error);
        }
      });
  },
};
