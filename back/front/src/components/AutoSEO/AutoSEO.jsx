import React from 'react';
import { useLocation } from 'react-router-dom';
import SEOMetaTags from '../Helmet/SEOMetaTags.jsx';
import { seoData } from '../../data/seoData/seoData.js';
import { isDevelopmentMode } from '@/utils/constants';

const AutoSEO = ({ children }) => {
  const location = useLocation();
  // trailing slash 제거 (예: '/ko/' -> '/ko')
  // 末尾スラッシュを除去（例: '/ko/' -> '/ko'）
  // Remove trailing slash (e.g. '/ko/' -> '/ko')
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  // 현재 경로에 맞는 SEO 정보 가져오기
  // 現在のパスに合うSEO情報を取得
  // Get SEO info for current path
  const seoInfo = seoData[currentPath] || seoData.default;

  // 디버깅용 로그 (개발 모드에서만)
  // デバッグ用ログ（開発モードのみ）
  // Debug log (dev mode only)
  if (isDevelopmentMode) {
    console.log('AutoSEO Debug:', {
      originalPath: location.pathname,
      cleanedPath: currentPath,
      foundInSeoData: !!seoData[currentPath],
      seoInfo: seoInfo,
    });
  }

  return (
    <>
      <SEOMetaTags {...seoInfo} />
      {children}
    </>
  );
};

export default AutoSEO;
