import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useLanguageChange } from '@/hooks';
import { getPathWithLang } from '../../config/route/UrlPaths.jsx';
import styles from './Navbar.module.scss';
import { MusicControlDesktop } from './MusicControl.jsx';
import {
  LanguageOptionMenu,
  LanguageOptionMenuForIcon,
} from './LanguageSelector.jsx';

/**
 * 데스크톱 네비게이션 메뉴
 */
export const NavContentMenu = ({
  isAnsweredForRedux,
  isWaitingForRedux,
  isToken,
  isCheckingToken,
  browserLanguageRef,
  changeLanguage,
  logout,
  isLanguageMenuOpen,
  setLanguageMenuOpen,
  signin,
  browserMusicRef,
  browserMusicBoxRef,
  isMusicMenuOpen,
  setMusicMenuOpen,
  isMusicPlaying,
  toggleMusic,
  musicVolume,
  handleVolumeChange,
  getVolumeIcon,
  needsInteraction,
  handleSpeakerIconClick,
  handlePreviousTrack,
  handleNextTrack,
  canGoPrevious,
  canGoNext,
}) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const PATHS = getPathWithLang(browserLanguage);

  // 언어 선택 드롭다운 토글 핸들러
  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(prev => !prev);
    // 볼륨 모달이 열려있으면 닫기
    if (isMusicMenuOpen) {
      setMusicMenuOpen(false);
    }
  };

  return (
    <>
      <MusicControlDesktop
        browserMusicRef={browserMusicRef}
        browserMusicBoxRef={browserMusicBoxRef}
        isMusicMenuOpen={isMusicMenuOpen}
        setMusicMenuOpen={setMusicMenuOpen}
        getVolumeIcon={getVolumeIcon}
        musicVolume={musicVolume}
        handleVolumeChange={handleVolumeChange}
        needsInteraction={needsInteraction}
        handleSpeakerIconClick={handleSpeakerIconClick}
        handlePreviousTrack={handlePreviousTrack}
        handleNextTrack={handleNextTrack}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isMusicPlaying={isMusicPlaying}
        toggleMusic={toggleMusic}
      />
      <div className={styles['empty']}></div>

      <div className={styles['menu-box']}>
        {isAnsweredForRedux || isWaitingForRedux ? (
          <div>{t(`header.principle`)}</div>
        ) : (
          <Link
            className={styles['link-tag-font-style']}
            to={PATHS.P5}
          >
            <div>{t(`header.principle`)}</div>
          </Link>
        )}
      </div>
      <div className={styles['empty']}></div>

      {!isCheckingToken && isToken === true && (
        <>
          <div className={styles['menu-box']}>
            {isAnsweredForRedux || isWaitingForRedux ? (
              <div>{t(`header.mypage`)}</div>
            ) : (
              <Link className={styles['link-tag-font-style']} to={PATHS.P13}>
                <div>{t(`header.mypage`)}</div>
              </Link>
            )}
          </div>
          <div className={styles['empty']}></div>
        </>
      )}

      {!isCheckingToken && isToken === true && (
        <>
          <div className={styles['menu-box']}>
            <Link
              className={styles['link-tag-font-style']}
              onClick={() => logout(isAnsweredForRedux, isWaitingForRedux)}
            >
              <div>{t(`header.logout`)}</div>
            </Link>
          </div>
          <div className={styles['empty']}></div>
        </>
      )}

      {!isCheckingToken && isToken === false && (
        <>
          <div className={styles['menu-box']}>
            <Link
              className={styles['link-tag-font-style']}
              onClick={() => signin(isAnsweredForRedux, isWaitingForRedux)}
            >
              <div>{t(`header.login`)}</div>
            </Link>
          </div>
          <div className={styles['empty']}></div>
        </>
      )}

      {!isCheckingToken && (isToken === true || isToken === false) && (
        <>
          <div className={styles['menu-box']}>
            {isAnsweredForRedux || isWaitingForRedux ? (
              <div>{t(`header.more`)}</div>
            ) : (
              <Link className={styles['link-tag-font-style']} to={PATHS.P9}>
                <div>{t(`header.more`)}</div>
              </Link>
            )}
          </div>
          <div className={styles['empty']}></div>
        </>
      )}

      <div
        ref={browserLanguageRef}
        className={`${styles['menu-box']} ${styles['language-dropDown-container']}`}
        onClick={handleLanguageMenuToggle}
      >
        <div>{t(`header.language`)}</div>
      </div>
      <LanguageOptionMenu
        isLanguageMenuOpen={isLanguageMenuOpen}
        changeLanguage={changeLanguage}
      />
    </>
  );
};

/**
 * 모바일 햄버거 메뉴 (아이콘 메뉴)
 */
export const MobileIconMenu = ({
  isAnsweredForRedux,
  isWaitingForRedux,
  isToken,
  isCheckingToken,
  browserLanguageRef,
  browserIconRef,
  browserDropBoxRef,
  isIconMenuOpen,
  setIconMenuOpen,
  isLanguageMenuOpen,
  setLanguageMenuOpen,
  changeLanguage,
  signin,
  logout,
  browserLanguage,
  isMusicMenuOpen,
  setMusicMenuOpen,
}) => {
  const { t } = useTranslation();
  const PATHS = getPathWithLang(browserLanguage);

  // 햄버거 메뉴 아이콘 토글 핸들러
  const handleIconMenuToggle = () => {
    setIconMenuOpen(prev => !prev);
    // 볼륨 모달이 열려있으면 닫기
    if (isMusicMenuOpen) {
      setMusicMenuOpen(false);
    }
  };

  // 언어 선택 드롭다운 토글 핸들러
  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(prev => !prev);
    // 볼륨 모달이 열려있으면 닫기
    if (isMusicMenuOpen) {
      setMusicMenuOpen(false);
    }
  };

  return (
    <>
      <FontAwesomeIcon
        className={`${
          browserLanguage === 'ja'
            ? styles['icon-dropDown-container-japanese']
            : styles['icon-dropDown-container']
        }`}
        icon={faBars}
        size={'xs'}
        style={{ color: '#FFD43B' }}
        onClick={handleIconMenuToggle}
        ref={browserIconRef}
      />
      {isIconMenuOpen === true && (
        <>
          <div className={styles['icon-dropDown-box']} ref={browserDropBoxRef}>
            <div className={styles['icon-dropDown-item']}>
              {isAnsweredForRedux || isWaitingForRedux ? (
                <div>{t(`header.principle`)}</div>
              ) : (
                <Link
                  className={styles['link-tag-font-style']}
                  to={PATHS.P5}
                >
                  <div>{t(`header.principle`)}</div>
                </Link>
              )}
            </div>

            {!isCheckingToken && isToken === true && (
              <div className={styles['icon-dropDown-item']}>
                {isAnsweredForRedux || isWaitingForRedux ? (
                  <div>{t(`header.mypage`)}</div>
                ) : (
                  <Link
                    className={styles['link-tag-font-style']}
                    to={PATHS.P13}
                  >
                    <div>{t(`header.mypage`)}</div>
                  </Link>
                )}
              </div>
            )}

            {!isCheckingToken && isToken === true && (
              <div className={styles['icon-dropDown-item']}>
                <Link
                  className={styles['link-tag-font-style']}
                  onClick={() => logout(isAnsweredForRedux, isWaitingForRedux)}
                >
                  <div>{t(`header.logout`)}</div>
                </Link>
              </div>
            )}

            {!isCheckingToken && isToken === false && (
              <div className={styles['icon-dropDown-item']}>
                <Link
                  className={styles['link-tag-font-style']}
                  onClick={() => signin(isAnsweredForRedux, isWaitingForRedux)}
                >
                  <div>{t(`header.login`)}</div>
                </Link>
              </div>
            )}

            {!isCheckingToken && (isToken === true || isToken === false) && (
              <>
                <div className={styles['icon-dropDown-item']}>
                  {isAnsweredForRedux || isWaitingForRedux ? (
                    <div>{t(`header.more`)}</div>
                  ) : (
                    <Link
                      className={styles['link-tag-font-style']}
                      to={PATHS.P9}
                    >
                      <div>{t(`header.more`)}</div>
                    </Link>
                  )}
                </div>
              </>
            )}

            <div
              ref={browserLanguageRef}
              className={styles['icon-dropDown-item']}
              onClick={handleLanguageMenuToggle}
            >
              <div>{t(`header.language`)}</div>
            </div>

            <LanguageOptionMenuForIcon
              isLanguageMenuOpen={isLanguageMenuOpen}
              changeLanguage={changeLanguage}
            />
          </div>
        </>
      )}
    </>
  );
};
