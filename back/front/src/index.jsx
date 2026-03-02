// 앱 엔트리포인트 - React, Redux, 라우터, Firebase, Sentry 초기화
// アプリエントリーポイント - React、Redux、ルーター、Firebase、Sentry初期化
// App entry point - React, Redux, router, Firebase, Sentry initialization

import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './store/store.jsx';
import { router } from '@/config/route/ROUTE';
import '/src/locales/i18n';
import LoadingForm from './components/Loading/Loading.jsx';
import { isDevelopmentMode } from '@/utils/constants';
// Firebase Analytics 초기화 (동기)
// Firebase Analytics初期化（同期）
// Firebase Analytics initialization (sync)
import { ensureFirebaseWebInitializedSync } from './firebaseApp';
// 전역 CSS 임포트
// グローバルCSSのインポート
// Global CSS import
import './index.css';
import * as Sentry from '@sentry/react';

// Sentry 성능 모니터링 - DSN은 환경변수(VITE_SENTRY_DSN)에서 로드
// Sentryパフォーマンス監視 - DSNは環境変数（VITE_SENTRY_DSN）から読み込み
// Sentry performance monitoring - DSN loaded from env (VITE_SENTRY_DSN)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN || '';
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/cosmos-tarot\.com\/api/],
  });
}

// 웹 환경에서 Firebase 초기화 (동기 버전 사용 - 하위 호환성)
// Web環境でFirebase初期化（同期版使用 - 下位互換性）
// Initialize Firebase on web (sync version for backward compatibility)
ensureFirebaseWebInitializedSync();

// 개발환경에서만 Service Worker 해제 (VitePWA가 프로덕션에서 자동 등록)
// 開発環境でのみService Worker解除（VitePWAが本番で自動登録）
// Unregister Service Worker in dev only (VitePWA auto-registers in production)
if (isDevelopmentMode && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// 개발환경 - React Scan/React Grab 툴 로드 (성능 저하 방지 위해 5초 지연)
// 開発環境 - React Scan/React Grabツール読み込み（パフォーマンス低下防止のため5秒遅延）
// Dev only - load React Scan/React Grab tools (5s delay to avoid perf impact)
if (isDevelopmentMode) {
  setTimeout(() => {
    // React Scan 스크립트 로드
    // React Scanスクリプト読み込み
    // Load React Scan script
    const script = document.createElement('script');
    script.crossOrigin = 'anonymous';
    script.src = '//unpkg.com/react-scan/dist/auto.global.js';
    document.head.appendChild(script);

    // React Grab 로드 - Cursor AI와 자동 연동, 요소 선택 시 클립보드에 컴포넌트/HTML/경로 복사
    // React Grab読み込み - Cursor AIと連携、要素選択でクリップボードにコンポーネント/HTML/パスをコピー
    // Load React Grab - Cursor AI integration; copies component/HTML/path to clipboard on element select
    import('//unpkg.com/react-grab/dist/index.global.js').then(module => {
      const { init } = module;

      const api = init({
        theme: {
          enabled: true, // disable all UI by setting to false
          hue: 180, // shift colors by 180 degrees (pink → cyan/turquoise)
          crosshair: {
            enabled: false, // disable crosshair
          },
          elementLabel: {
            enabled: false, // disable element label
          },
        },
        onElementSelect: element => {
          console.log('Selected:', element);
        },
        onCopySuccess: (elements, content) => {
          console.log('Copied to clipboard:', content);
        },
        onStateChange: state => {
          console.log('Active:', state.isActive);
        },
      });

      api.activate();
    });
  }, 5000); // 5초 지연 // 5秒遅延 // 5 second delay
}

const rootElement = document.getElementById('root');

const app = (
  <HelmetProvider>
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<LoadingForm />} />
    </Provider>
  </HelmetProvider>
);

// 사전렌더링된 HTML 있으면 hydrate, 없으면 render (SEO/초기로딩 최적화)
// プリレンダリングHTMLがあればhydrate、なければrender（SEO/初回ロード最適化）
// If pre-rendered HTML exists use hydrate, else render (SEO/initial load optimization)
if (rootElement.hasChildNodes()) {
  try {
    hydrateRoot(rootElement, app);
  } catch (error) {
    console.error('Hydration failed:', error);
    ReactDOM.createRoot(rootElement).render(app);
  }
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
