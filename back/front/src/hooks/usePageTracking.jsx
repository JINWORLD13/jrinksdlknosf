/**
 * 페이지 이동 자동 추적 Hook
 * 경로 매칭: ROUTE_ENV_KEYS 인덱스만 사용 (실제 경로·키명 유추 불가)
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setScreen, log } from '@/analytics';
import { getCountryCode } from '@/utils/country/detectCountry';
import { ROUTE_ENV } from '@/config/routeEnv';

const getVal = (i) => ROUTE_ENV[i];

// [ROUTE_ENV_KEYS 인덱스 배열, 화면명] — 경로는 인덱스로만 참조
const ROUTE_LIST = [
  [[0], 'Home'],
  [[1], 'Logout'],
  [[2], 'GeneralReading'],
  [[3], 'GeneralReadingSpread'],
  [[4], 'TarotPrinciple'],
  [[5], 'TarotExplanation'],
  [[6], 'TarotLearning'],
  [[7], 'TarotCardTable'],
  [[13], 'MyPage'],
  [[13, 14], 'MyPageReadingInfo'],
  [[13, 15, 16], 'MyPageTotalChart'],
  [[13, 15, 17], 'MyPageSubjectChart'],
  [[13, 15, 18], 'MyPageQuestionTopicChart'],
  [[13, 19], 'MyPageWithdraw'],
  [[20], 'MyPageRefund'],
  [[9], 'ETC'],
  [[9, 10], 'ETCBusinessInfo'],
  [[9, 4], 'ETCTarotPrinciple'],
  [[9, 5], 'ETCTarotExplanation'],
  [[9, 6], 'ETCTarotLearning'],
  [[21], 'TossSuccess'],
  [[22], 'TossFail'],
];

const buildRoutesMap = () => {
  const map = {};
  for (const [ixList, name] of ROUTE_LIST) {
    const parts = ixList.map(getVal).filter((v) => v != null && v !== '');
    const path = parts.length ? '/' + parts.join('/') : '/';
    if (path) map[path.replace(/\/+/g, '/')] = name;
  }
  return map;
};

const getPageName = (pathname) => {
  const pathWithoutLang = pathname.replace(/^\/(ko|en|ja)/, '') || '/';
  const routes = buildRoutesMap();
  if (routes[pathWithoutLang]) return routes[pathWithoutLang];

  const prefixParts = [getVal(13), getVal(15), getVal(23)].filter(Boolean);
  const prefix = prefixParts.length === 3 ? '/' + prefixParts.join('/') + '/' : '';
  if (prefix && pathWithoutLang.includes(prefix)) return 'MyPageThemeChart';

  return pathWithoutLang || 'Unknown';
};

const getLanguage = (pathname) => {
  const match = pathname.match(/^\/(ko|en|ja)/);
  return match ? match[1] : 'ko';
};

export const usePageTracking = () => {
  const location = useLocation();
  const previousPath = useRef(null);
  const pageStartTime = useRef(Date.now());
  const userInfo = useSelector((state) => state.userInfoStore?.userInfo);

  useEffect(() => {
    if (location.pathname.match(/\.(xml|txt|json|ico|jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2|eot|bin|gltf|html|css|js)$/)) return;

    const currentPath = location.pathname;
    if (previousPath.current !== currentPath) {
      const pageName = getPageName(currentPath);
      const language = getLanguage(currentPath);
      const country = getCountryCode({ userCountry: userInfo?.country, language });
      pageStartTime.current = Date.now();
      setScreen(pageName);
      log('page_view', {
        page_name: pageName,
        page_path: currentPath,
        referrer_page: previousPath.current || 'direct',
        language,
        country,
        query_params: location.search || '',
      });
      previousPath.current = currentPath;
    }

    return () => {
      if (pageStartTime.current && Date.now() - pageStartTime.current > 1000) {
        log('user_engagement', {
          screen_name: getPageName(location.pathname),
          engagement_time_msec: Date.now() - pageStartTime.current,
        });
      }
    };
  }, [location, userInfo]);
};

export default usePageTracking;
