/*eslint-disable*/
// 앱 루트 컴포넌트 - 라우팅, 레이아웃, 전역 상태 관리
// アプリルートコンポーネント - ルーティング、レイアウト、グローバル状態管理
// App root component - routing, layout, global state management

import React, { Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import StarryBackground from './components/StarryBackground/StarryBackground.jsx';
import { Outlet } from 'react-router-dom';
import SEOMetaTags from './components/Helmet/SEOMetaTags.jsx';
import { Capacitor } from '@capacitor/core';
import LoadingForm from './components/Loading/Loading.jsx';
import AutoSEO from './components/AutoSEO/AutoSEO.jsx';
import MusicPlayer from './components/MusicPlayer/MusicPlayer.jsx';
import MusicStartNotice from './components/MusicPlayer/MusicStartNotice.jsx';
import { useMusicSettings, useVersionCheck } from '@/hooks';
import { Analytics } from './analytics';
import { usePageTracking } from './hooks/usePageTracking';
import { ModalBackHandlerProvider } from './contexts/ModalBackHandlerContext';
import { restoreDailyFortuneSchedule } from './services/dailyFortuneNotificationService';

const isNative = Capacitor.isNativePlatform();

// 모바일 기기 감지 (브라우저/네이티브 앱 무관)
// モバイルデバイス検出（ブラウザ/ネイティブアプリ問わず）
// Detect mobile device (regardless of browser or native app)
if (typeof document !== 'undefined' && typeof navigator !== 'undefined') {
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  document.body.classList.add(isMobileDevice ? 'is-mobile' : 'is-desktop');
}

// Celtic Cross 스프레드 CSS 변수만 전역 import (성능 최적화)
// Celtic CrossスプレッドのCSS変数のみグローバルimport（パフォーマンス最適化）
// Global import of Celtic Cross spread CSS variables only (performance optimization)
import './styles/scss/CelticCrossVariables.module.scss';

const preloadThreeModel = () => {
  import('@react-three/drei').then(({ useGLTF }) => {
    useGLTF.preload('/assets/model/character-fbx/model.gltf');
    useGLTF.preload('/assets/model/magic-circle/magicCircle.gltf');
  });
};

// requestIdleCallback으로 브라우저 idle 시 preload 실행 (Safari 등 미지원 시 setTimeout fallback)
// requestIdleCallbackでブラウザアイドル時にプリロード実行（Safari等非対応時はsetTimeoutフォールバック）
// Run preload on browser idle via requestIdleCallback (setTimeout fallback for Safari etc.)
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadThreeModel, { timeout: 3000 });
  } else {
    setTimeout(preloadThreeModel, 1000);
  }
}

function App() {
  // 페이지 이동 자동 추적 (Analytics)
  // ページ遷移の自動トラッキング（Analytics）
  // Automatic page view tracking (Analytics)
  usePageTracking();

  // 버전 체크
  // バージョンチェック
  // Version check
  const { isCheckingVersion, canUseApp } = useVersionCheck();
  // 음악 설정 로드 (커스텀 훅)
  // 音楽設定読み込み（カスタムフック）
  // Load music settings (custom hook)
  const isMusicSettingsLoaded = useMusicSettings();

  // 네이티브면 광고모드부터 표시, 웹이면 이용권 모드
  // ネイティブなら広告モードから表示、Webならチケットモード
  // Native shows ad mode first; web uses voucher mode
  const [isVoucherModeOnForApp, setIsVoucherModeOnForApp] = useState(() => {
    if (isNative) return false;
    if (!isNative) return true;
  });
  const [selectedTarotModeForApp, setSelectedTarotModeForApp] = useState(2);
  const [hasWatchedAdForApp, setWatchedAdForApp] = useState(false);
  const [answerFormForApp, setAnswerFormForApp] = useState(false);
  const [modalFormForApp, setModalFormForApp] = useState({
    spread: false,
    tarot: false,
  });
  // 두루마기 모달(AI 해석 포함) 열림 상태
  // スルマキモーダル（AI解釈含む）の開閉状態
  // Durumagi modal (with AI interpretation) open state
  const [
    isDurumagiModalWithInterpretationOpen,
    setIsDurumagiModalWithInterpretationOpen,
  ] = useState(false);

  // Firebase Analytics - 앱 실행 이벤트 전송 (버전/음악 설정 로드 완료 후)
  // Firebase Analytics - アプリ起動イベント送信（バージョン/音楽設定読み込み完了後）
  // Firebase Analytics - send app_open event (after version/music settings loaded)
  useEffect(() => {
    if (!isCheckingVersion && canUseApp && isMusicSettingsLoaded) {
      Analytics.app_open();
    }
  }, [isCheckingVersion, canUseApp, isMusicSettingsLoaded]);

  // 네이티브 - 오늘의 운세 알림 스케줄 복구 (설정 켜져 있으면 매일 8시 알림 재등록)
  // ネイティブ - 今日の運勢通知スケジュール復元（設定ONなら毎日8時に再登録）
  // Native - restore daily fortune notification schedule (re-register 8am if enabled)
  useEffect(() => {
    if (!isNative || !canUseApp) return;
    restoreDailyFortuneSchedule();
  }, [canUseApp]);

  // 버전 체크 중 - 로딩 화면 표시
  // バージョンチェック中 - ローディング画面を表示
  // Version checking - show loading screen
  if (isCheckingVersion) {
    return <LoadingForm />;
  }

  // 업데이트 필요 - 다이얼로그가 표시되고 있음
  // アップデート必要 - ダイアログ表示中
  // Update required - dialog is being shown
  if (!canUseApp) {
    return null;
  }

  // 정상 앱 렌더링 - 모달 백핸들러, AutoSEO, 별배경, 네비게이션, 라우팅 아웃렛
  // 正常なアプリレンダリング - モーダルバックハンドラー、AutoSEO、星空背景、ナビゲーション、ルーティングアウトレット
  // Normal app render - modal back handler, AutoSEO, starry background, nav, routing outlet
  return (
    <ModalBackHandlerProvider>
      <AutoSEO>
        <div>
          <StarryBackground />

          {isMusicSettingsLoaded && <MusicPlayer />}
          {isMusicSettingsLoaded && <MusicStartNotice />}
          <Navbar
            setAnswerFormForApp={setAnswerFormForApp}
            setWatchedAdForApp={setWatchedAdForApp}
            setModalFormForApp={setModalFormForApp}
          />
          <Suspense fallback={<LoadingForm />}>
            <Outlet
              context={{
                setSelectedTarotModeForApp,
                setIsVoucherModeOnForApp,
                setWatchedAdForApp,
                setAnswerFormForApp,
                setModalFormForApp,
                setIsDurumagiModalWithInterpretationOpen,
              }}
            />
          </Suspense>
          <Footer
            selectedTarotModeForApp={selectedTarotModeForApp}
            isVoucherModeOnForApp={isVoucherModeOnForApp}
            hasWatchedAdForApp={hasWatchedAdForApp}
            answerFormForApp={answerFormForApp}
            modalFormForApp={modalFormForApp}
            isDurumagiModalWithInterpretationOpen={
              isDurumagiModalWithInterpretationOpen
            }
          />
        </div>
      </AutoSEO>
    </ModalBackHandlerProvider>
  );
}

export default App;
