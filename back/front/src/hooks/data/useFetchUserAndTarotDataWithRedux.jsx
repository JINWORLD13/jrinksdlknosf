import { useCallback, useState } from 'react';
import { setTarotHistoryAction } from '../../store/tarotHistoryStore.jsx';
import { setUserInfoAction } from '../../store/userInfoStore.jsx';
import { setCounsleeInfo } from '../../utils/storage/counsleeInfoStorage.jsx';

export const userCacheForRedux = new Map();
export const tarotCacheForRedux = new Map();
//! 리덕스 쓰는 이유: spa 장점은 페이지 이동이 바로바로 된다. 근데 새로고침 한다? 비효율이고 대역폭도 는다. 되도록 데이터 변동이 될때만 axios 요청하는 걸로 하고, 나머진 리덕스 같은데에서 공유해서 쓸 수 있게 하기.
const useFetchUserAndTarotDataWithRedux = (tarotApi, userApi, dispatch) => {
  const cleanupInterceptorArr = [];

  const [isActivated, setActivated] = useState(false);
  
  /**
   * 사용자 및 타로 데이터 가져오기
   * @param {Object} cancelToken - axios CancelToken (선택적)
   */
  const getUserAndTarot = async (cancelToken = null) => {
    if (isActivated === true) return;
    setActivated(true);
    try {
      // 타로 히스토리 가져오기
      if (
        tarotCacheForRedux?.get('/tarot/history') === undefined ||
        tarotCacheForRedux?.get('/tarot/history') === null
      ) {
        let fetchedTarotData;
        
        // cancelToken이 있으면 전달, 없으면 null
        const { response, cleanup: cleanupForGetHistory } =
          await tarotApi.getHistory(cancelToken);
        cleanupInterceptorArr.push(cleanupForGetHistory);
        fetchedTarotData = response;
        
        // cancelToken으로 취소된 경우 대비 (getHistoryForSub은 cancelToken 없이)
        if (fetchedTarotData === undefined || fetchedTarotData === null) {
          const { response, cleanup: cleanupForGetHistorySub } =
            await tarotApi.getHistoryForSub();
          cleanupInterceptorArr.push(cleanupForGetHistorySub);
          fetchedTarotData = response;
        }
        
        tarotCacheForRedux?.set('/tarot/history', fetchedTarotData);
        dispatch(setTarotHistoryAction(fetchedTarotData));
      }

      // 사용자 정보 가져오기
      if (
        userCacheForRedux?.get('/user/userinfo') === undefined ||
        userCacheForRedux?.get('/user/userinfo') === null
      ) {
        let fetchedUserData;
        
        // cancelToken이 있으면 전달, 없으면 null
        const { response, cleanup: cleanupForGetUser } = 
          await userApi.get(cancelToken);
        cleanupInterceptorArr.push(cleanupForGetUser);
        fetchedUserData = response;
        
        // cancelToken으로 취소된 경우 대비 (getForSub은 cancelToken 없이)
        if (fetchedUserData === undefined || fetchedUserData === null) {
          const { response, cleanup: cleanupForGetUserSub } =
            await userApi.getForSub();
          cleanupInterceptorArr.push(cleanupForGetUserSub);
          fetchedUserData = response;
        }
        
        // 접속 시 DB의 내담자 정보(계정별·언어별)를 로컬/Preferences에 동기화 → 모달 열 때 getCounsleeInfo로 입력창에 채워짐
        if (
          fetchedUserData?.email &&
          fetchedUserData?.counsleeInfo != null &&
          typeof fetchedUserData.counsleeInfo === 'object' &&
          !Array.isArray(fetchedUserData.counsleeInfo)
        ) {
          try {
            const ci = fetchedUserData.counsleeInfo;
            const isLegacyFormat = 'name' in ci || 'referenceNote' in ci;
            if (isLegacyFormat) {
              await setCounsleeInfo(ci, fetchedUserData.email, 'ko');
            } else {
              for (const lang of Object.keys(ci)) {
                if (ci[lang] && typeof ci[lang] === 'object' && !Array.isArray(ci[lang])) {
                  await setCounsleeInfo(ci[lang], fetchedUserData.email, lang);
                }
              }
            }
          } catch (e) {
            console.warn('counsleeInfo sync from DB to local failed', e);
          }
        }
        
        userCacheForRedux?.set('/user/userinfo', fetchedUserData);
        dispatch(setUserInfoAction(fetchedUserData));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActivated(false);
    }
  };

  const clearCaches = useCallback(() => {
    tarotCacheForRedux.clear();
    userCacheForRedux.clear();
  }, []);

  return { getUserAndTarot, clearCaches, cleanupInterceptorArr };
};

export default useFetchUserAndTarotDataWithRedux;
