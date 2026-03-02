import React from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  createBrowserRouter,
} from 'react-router-dom';
import {
  P0, P1, P2, P3, P4, P5, P6, P7, P9, P10, P11, P12,
  P13, P14, P15, P16, P17, P18, P19, P20, P21, P22,
} from './UrlPaths.jsx';
import App from '../../App.jsx';
import Home from '../../pages/Home/Home.jsx';
import TarotCardPrincipleForm from '../../pages/Tarot/Principle/TarotCardPrincipleForm.jsx';
import MyPageForm from '../../pages/MyPage/MyPageForm.jsx';
import TossSuccessPage from '../../components/Charge/TossSuccessPage.jsx';
import TossFailPage from '../../components/Charge/TossFailPage.jsx';
import ETCForm from '../../pages/ETC/ETCForm.jsx';
import ErrorPage from '../../pages/ErrorPage/ErrorPage.jsx';
import UserVoucherRefundPage from '../../pages/MyPage/voucher/UserVoucherRefundPage.jsx';
import TarotExplanationForm from '../../pages/Tarot/Explanation/TarotExplanationForm.jsx';
import TarotSectionForm from '../../pages/Tarot/Section/TarotSectionForm.jsx';
import { useEffect, useState } from 'react';
import { useLanguageChange } from '@/hooks';
import MyPagePage from '../../pages/MyPage/MyPagePage.jsx';
import SpreadModal from '../../modals/SpreadModal/SpreadModal.jsx';

// 호스팅만 입력시 또는 언어 코드가 없는 경로
export const LanguageRedirect = () => {
  const browserLanguage = useLanguageChange();
  const location = useLocation();

  // 이미 언어 코드가 있는 경로인지 확인
  let pathname = location.pathname;

  // trailing slash 제거 (루트 제외)
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  const firstSegment = pathname.split('/')[1];
  const hasLanguageCode = ['en', 'ko', 'ja'].includes(firstSegment);

  // API 경로는 언어 리다이렉트에서 제외
  const isApiPath =
    pathname.startsWith('/tarot') ||
    pathname.startsWith('/authenticate') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/google') ||
    pathname.startsWith('/version') ||
    pathname.startsWith('/referral') ||
    pathname.startsWith('/health');

  // API 경로는 리다이렉트하지 않음
  if (isApiPath) {
    return null;
  }

  // 이미 언어 코드가 있으면 리다이렉트하지 않음 (무한 루프 방지)
  if (hasLanguageCode) {
    // trailing slash가 있으면 제거하고 리다이렉트
    if (location.pathname !== pathname) {
      return <Navigate to={pathname} replace />;
    }
    return null; // 또는 <Navigate to={pathname} replace />로 현재 경로 유지
  }

  // 현재 경로가 루트가 아닌 경우 경로를 유지하면서 언어 코드 추가
  const targetPath =
    pathname === '/' ? `/${browserLanguage}` : `/${browserLanguage}${pathname}`;

  return <Navigate to={targetPath} replace />;
};

export const LanguageAwareApp = () => {
  const browserLanguage = useLanguageChange(); // 브라우저 언어 가져오기 (예: 'en', 'ko', 'ja')
  const location = useLocation(); // 현재 URL 정보 // 호스팅 뒤에 path 적용시,
  const navigate = useNavigate(); // URL 이동
  const { lang: currentLang } = useParams(); // URL에서 언어 파라미터 가져오기
  // alert(JSON.stringify(location, currentLang))
  // 메뉴에서 언어 변경시, URL 업데이트

  useEffect(() => {
    // 정적 파일들은 리다이렉션하지 않음
    if (
      location.pathname.match(
        /\.(xml|txt|json|ico|jpg|jpeg|png|gif|webp|svg|ttf|woff|woff2|eot|bin|gltf|html|css|js)$/
      )
    )
      return;

    // API 경로는 언어 리다이렉트에서 제외
    const isApiPath =
      location.pathname.startsWith('/tarot') ||
      location.pathname.startsWith('/authenticate') ||
      location.pathname.startsWith('/user') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/payments') ||
      location.pathname.startsWith('/google') ||
      location.pathname.startsWith('/version') ||
      location.pathname.startsWith('/referral') ||
      location.pathname.startsWith('/health');

    // API 경로는 리다이렉트하지 않음
    if (isApiPath) {
      return;
    }

    let newPath;
    const search = location.search; // 쿼리 파라미터 유지

    // trailing slash 제거 (루트 경로 제외)
    let cleanPathname = location.pathname;
    if (cleanPathname !== '/' && cleanPathname.endsWith('/')) {
      cleanPathname = cleanPathname.slice(0, -1);
    }

    if (['en', 'ko', 'ja'].includes(cleanPathname.slice(1, 3))) {
      if (browserLanguage && browserLanguage !== currentLang.slice(0, 2)) {
        newPath = `/${browserLanguage}${cleanPathname.replace(
          /^\/[^/]+/,
          ''
        )}${search}`;
      } else {
        newPath = `${cleanPathname}${search}`;
      }
    } else {
      newPath = `/${browserLanguage}${cleanPathname}${search}`;
    }

    // trailing slash가 있었거나 경로가 변경된 경우에만 navigate
    if (
      location.pathname !== cleanPathname ||
      newPath !== location.pathname + search
    ) {
      navigate(newPath, { replace: true });
    }
  }, [
    browserLanguage,
    currentLang,
    location.pathname,
    location.search,
    navigate,
  ]);
  return <App />;
};

//! /index는 프리렌더용으로 쓰려다가 새로고침시 홈화면과 중첩되므로, /prerender로 뺌... 그리고 일단 무분별하게 조건부 있는 컴포넌트들 마운트 시킴
//! 중첩된 라우트에서는 자식 컴포넌트만 정의하고, 부모 컴포넌트에서 Outlet을 사용하여 자식 컴포넌트를 렌더링하는 것이 좋다. MyPageForm과 ETCForm.
//~ URL 파라미터(parameter) 문법 : /:문자 (/다음에 아무 문자나 와도 됨. 변수라서. 콜론(:)으로 시작하는 부분은 동적 세그먼트(dynamic segment) 또는 URL 파라미터라고 부르며, 이는 변수처럼 다양한 값을 받을 수 있다.)

// Route
// "/ko/tarot/principle",
// "/en/tarot/principle",
// "/ja/tarot/principle",
// "/ko/etc/tarot/learning",
// "/ko/etc/tarot/explanation",
// "/en/etc/tarot/learning",
// "/en/etc/tarot/explanation",
// "/ja/etc/tarot/learning",
// "/ja/etc/tarot/explanation",
// "/ko/etc",
// "/en/etc",
// "/ja/etc",
// "/ko/mypage/chart/totalchart",
// "/ko/mypage/chart/subjectchart",
// "/ko/mypage/chart/questiontopicchart",
// "/en/mypage/chart/totalchart",
// "/en/mypage/chart/subjectchart",
// "/en/mypage/chart/questiontopicchart",
// "/ja/mypage/chart/totalchart",
// "/ja/mypage/chart/subjectchart",
// "/ja/mypage/chart/questiontopicchart"
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LanguageRedirect />,
  },
  {
    path: '/:lang',
    element: <LanguageAwareApp />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: P3, element: <Home /> },
      { path: P4, element: <Home /> },
      { path: P2, element: <Home /> },
      { path: P5, element: <TarotCardPrincipleForm /> },
      { path: P6, element: <TarotCardPrincipleForm /> },
      { path: P7, element: <TarotCardPrincipleForm /> },
      { path: P1, element: null },
      { path: P21, element: <TossSuccessPage /> },
      { path: P22, element: <TossFailPage /> },
      { path: P20, element: <UserVoucherRefundPage /> },
      { path: P13, element: <MyPageForm /> },
      { path: `${P13}/${P14}`.replace(/\/+/g, '/'), element: <MyPageForm /> },
      { path: `${P13}/${P15}/${P16}`.replace(/\/+/g, '/'), element: <MyPageForm /> },
      { path: `${P13}/${P15}/${P17}`.replace(/\/+/g, '/'), element: <MyPageForm /> },
      { path: `${P13}/${P15}/${P18}`.replace(/\/+/g, '/'), element: <MyPageForm /> },
      { path: `${P13}/${P19}`.replace(/\/+/g, '/'), element: <MyPageForm /> },
      { path: P9, element: <ETCForm /> },
      { path: `${P9}/${P10}`.replace(/\/+/g, '/'), element: <ETCForm /> },
      { path: `${P9}/${P11}`.replace(/\/+/g, '/'), element: <ETCForm /> },
      { path: `${P9}/${P12}`.replace(/\/+/g, '/'), element: <ETCForm /> },
      { path: `${P9}/${P7}`.replace(/\/+/g, '/'), element: <TarotCardPrincipleForm /> },
      { path: `${P9}/${P6}`.replace(/\/+/g, '/'), element: <TarotCardPrincipleForm /> },
    ],
  },
  // 와일드카드 라우트: 언어 코드가 없는 모든 경로를 언어 감지 후 리다이렉트
  {
    path: '*',
    element: <LanguageRedirect />,
  },
]);
