import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../../locales/i18n.js';
import styles from './Navbar.module.scss';
import {
  setIsAnswered,
  setIsWaiting,
  setIsDoneAnimationOfBackground,
  setIsReadyToShowDurumagi,
} from '../../store/booleanStore.jsx';
import { getPathWithLang } from '../../config/route/UrlPaths.jsx';
import { useLanguageChange } from '@/hooks';
import { useWindowSizeState } from '@/hooks';
import { useAuth } from '@/hooks';
import { useMusicControl } from '@/hooks';
import { useMenuManager } from '@/hooks';
import { useDeepLink } from '@/hooks';
import { NavContentMenu, MobileIconMenu } from './NavMenu.jsx';
import { MusicControlMobile } from './MusicControl.jsx';

const Navbar = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: currentLang } = useParams();
  const { t } = useTranslation();

  // Redux 상태
  const isWaitingForRedux = useSelector(state => state.booleanStore.isWaiting);
  const isAnsweredForRedux = useSelector(
    state => state.booleanStore.isAnswered
  );

  // 커스텀 훅들
  const { windowWidth } = useWindowSizeState();
  const browserLanguage = useLanguageChange();
  const PATHS = getPathWithLang(browserLanguage);

  const { isToken, isCheckingToken, signin, logout } = useAuth();

  const {
    isMusicPlaying,
    musicVolume,
    needsInteraction,
    isLandscape,
    toggleMusic,
    handleVolumeChange,
    getVolumeIcon,
    handleSpeakerIconClick,
    handlePreviousTrack,
    handleNextTrack,
    canGoPrevious,
    canGoNext,
  } = useMusicControl();

  const {
    isLanguageMenuOpen,
    setLanguageMenuOpen,
    isIconMenuOpen,
    setIconMenuOpen,
    isMusicMenuOpen,
    setMusicMenuOpen,
    browserLanguageRef,
    browserIconRef,
    browserDropBoxRef,
    browserMusicRef,
    browserMusicBoxRef,
  } = useMenuManager();

  // 딥링크 처리 (Capacitor용)
  useDeepLink('cosmostarot', new URL(import.meta.env.VITE_SERVER_URL).hostname);

  // 언어 변경 핸들러
  const changeLanguage = lan => {
    if (isAnsweredForRedux || isWaitingForRedux) return;

    const pathname = location.pathname;
    const nextPath = pathname.replace(/^\/(en|ja|ko)/, `/${lan}`);

    i18n.changeLanguage(lan);
    navigate(nextPath, { replace: false });
    setLanguageMenuOpen(false);
  };

  // 로고 클릭 핸들러
  // ロゴクリックハンドラー
  // Logo click handler
  const handleLogoClick = () => {
    if (isAnsweredForRedux || isWaitingForRedux) return;

    dispatch(setIsAnswered(false));
    dispatch(setIsWaiting(false));

    if (props?.setAnswerFormForApp)
      props?.setAnswerFormForApp(prev => ({
        ...prev,
        isSubmitted: false,
        isWaiting: false,
        isAnswered: false,
      }));

    if (props?.setWatchedAdForApp) props?.setWatchedAdForApp(false);

    if (props?.setModalFormForApp)
      props?.setModalFormForApp({ spread: false, tarot: false });

    dispatch(setIsDoneAnimationOfBackground(false));
    dispatch(setIsReadyToShowDurumagi(false));

    if ('/' + currentLang === location.pathname) window.location.reload();
  };

  return (
    <nav
      className={`${
        browserLanguage === 'ja' ? styles['navbar-japanese'] : styles['navbar']
      }`}
    >
      <div className={styles['container']}>
        <div className={styles['title-wrapper']} onClick={handleLogoClick}>
          <Link className={styles['title-link']} to={PATHS.P0}>
            <div className={styles['title-text']}>{t(`header.logo`)}</div>
          </Link>
        </div>

        <div className={styles['spacer']}></div>

        <div className={styles['menu-container']}>
          {/* 데스크톱 메뉴 (1366px 초과) */}
          {windowWidth > 1366 && (
            <NavContentMenu
              isAnsweredForRedux={isAnsweredForRedux}
              isWaitingForRedux={isWaitingForRedux}
              isToken={isToken}
              isCheckingToken={isCheckingToken}
              browserLanguageRef={browserLanguageRef}
              changeLanguage={changeLanguage}
              logout={logout}
              isLanguageMenuOpen={isLanguageMenuOpen}
              setLanguageMenuOpen={setLanguageMenuOpen}
              signin={signin}
              browserMusicRef={browserMusicRef}
              browserMusicBoxRef={browserMusicBoxRef}
              isMusicMenuOpen={isMusicMenuOpen}
              setMusicMenuOpen={setMusicMenuOpen}
              isMusicPlaying={isMusicPlaying}
              toggleMusic={toggleMusic}
              musicVolume={musicVolume}
              handleVolumeChange={handleVolumeChange}
              getVolumeIcon={getVolumeIcon}
              needsInteraction={needsInteraction}
              handleSpeakerIconClick={handleSpeakerIconClick}
              handlePreviousTrack={handlePreviousTrack}
              handleNextTrack={handleNextTrack}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
            />
          )}

          {/* 모바일 메뉴 (1366px 이하) */}
          {windowWidth <= 1366 && (
            <>
              <MusicControlMobile
                browserMusicRef={browserMusicRef}
                browserMusicBoxRef={browserMusicBoxRef}
                isMusicMenuOpen={isMusicMenuOpen}
                setMusicMenuOpen={setMusicMenuOpen}
                getVolumeIcon={getVolumeIcon}
                musicVolume={musicVolume}
                handleVolumeChange={handleVolumeChange}
                needsInteraction={needsInteraction}
                browserLanguage={browserLanguage}
                windowWidth={windowWidth}
                isLandscape={isLandscape}
                isIconMenuOpen={isIconMenuOpen}
                handleSpeakerIconClick={handleSpeakerIconClick}
                handlePreviousTrack={handlePreviousTrack}
                handleNextTrack={handleNextTrack}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                isMusicPlaying={isMusicPlaying}
                toggleMusic={toggleMusic}
              />

              <MobileIconMenu
                isAnsweredForRedux={isAnsweredForRedux}
                isWaitingForRedux={isWaitingForRedux}
                isToken={isToken}
                isCheckingToken={isCheckingToken}
                browserLanguageRef={browserLanguageRef}
                browserIconRef={browserIconRef}
                browserDropBoxRef={browserDropBoxRef}
                isIconMenuOpen={isIconMenuOpen}
                setIconMenuOpen={setIconMenuOpen}
                isLanguageMenuOpen={isLanguageMenuOpen}
                setLanguageMenuOpen={setLanguageMenuOpen}
                changeLanguage={changeLanguage}
                signin={signin}
                logout={logout}
                browserLanguage={browserLanguage}
                isMusicMenuOpen={isMusicMenuOpen}
                setMusicMenuOpen={setMusicMenuOpen}
              />
            </>
          )}

          <div className={styles['empty']}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
