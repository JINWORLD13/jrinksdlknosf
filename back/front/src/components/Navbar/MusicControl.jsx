import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faForwardStep,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.scss';

/**
 * 음악 컨트롤 컴포넌트 (데스크톱용)
 */
export const MusicControlDesktop = ({
  browserMusicRef,
  browserMusicBoxRef,
  isMusicMenuOpen,
  setMusicMenuOpen,
  getVolumeIcon,
  musicVolume,
  handleVolumeChange,
  needsInteraction,
  handleSpeakerIconClick,
  handlePreviousTrack,
  handleNextTrack,
  canGoPrevious,
  canGoNext,
  isMusicPlaying,
  toggleMusic,
}) => {
  return (
    <div
      className={`${styles['menu-box']} ${styles['music-control-box']}`}
      style={{ position: 'relative' }}
    >
      <FontAwesomeIcon
        icon={getVolumeIcon()}
        style={{
          color: '#FFD43B',
          cursor: 'pointer',
          fontSize: '1.25rem',
          animation: needsInteraction
            ? 'pulse 2s ease-in-out infinite'
            : 'none',
        }}
        onClick={() =>
          handleSpeakerIconClick(isMusicMenuOpen, setMusicMenuOpen)
        }
        ref={browserMusicRef}
      />
      {isMusicMenuOpen && (
        <div
          className={styles['music-volume-box-desktop']}
          ref={browserMusicBoxRef}
        >
          {/* 이전곡/재생/일시정지/다음곡 버튼 - 가로로 나열 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              paddingBottom: '8px',
              paddingTop: '4px',
              borderBottom: '1px solid rgba(255, 212, 59, 0.2)',
            }}
          >
            {/* 이전 곡 */}
            <button
              onClick={handlePreviousTrack}
              disabled={!canGoPrevious}
              style={{
                background: 'none',
                border: 'none',
                cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                color: canGoPrevious ? '#FFD43B' : 'rgba(255, 212, 59, 0.3)',
                fontSize: '1.2rem',
                padding: '5px 8px',
                transition: 'all 0.2s',
              }}
              title="이전 곡"
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            {/* 재생/일시정지 */}
            <button
              onClick={toggleMusic}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FFD43B',
                fontSize: '1.3rem',
                padding: '5px 10px',
                transition: 'all 0.2s',
              }}
              title={isMusicPlaying ? '일시정지' : '재생'}
            >
              <FontAwesomeIcon icon={isMusicPlaying ? faPause : faPlay} />
            </button>

            {/* 다음 곡 */}
            <button
              onClick={handleNextTrack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FFD43B',
                fontSize: '1.2rem',
                padding: '5px 8px',
                transition: 'all 0.2s',
              }}
              title="다음 곡"
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>

          {/* 볼륨 조절 */}
          <div className={styles['music-control-item']}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                width: '100%',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={handleVolumeChange}
                className={styles['volume-slider']}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  minWidth: '45px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 음악 컨트롤 컴포넌트 (모바일용)
 */
export const MusicControlMobile = ({
  browserMusicRef,
  browserMusicBoxRef,
  isMusicMenuOpen,
  setMusicMenuOpen,
  getVolumeIcon,
  musicVolume,
  handleVolumeChange,
  needsInteraction,
  browserLanguage,
  windowWidth,
  isLandscape,
  isIconMenuOpen,
  handleSpeakerIconClick,
  handlePreviousTrack,
  handleNextTrack,
  canGoPrevious,
  canGoNext,
  isMusicPlaying,
  toggleMusic,
}) => {
  return (
    <div className={styles['music-mobile-wrapper']}>
      {/* 933px 미만 가로모드: 메뉴 닫힐 때만 보임, 그 외: 항상 보임 */}
      {(windowWidth >= 933 || !isLandscape || !isIconMenuOpen) && (
        <FontAwesomeIcon
          className={`${
            browserLanguage === 'ja'
              ? styles['music-icon-container-japanese']
              : styles['music-icon-container']
          } ${needsInteraction ? styles['needs-interaction'] : ''}`}
          icon={getVolumeIcon()}
          style={{
            color: '#FFD43B',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={() =>
            handleSpeakerIconClick(isMusicMenuOpen, setMusicMenuOpen)
          }
          ref={browserMusicRef}
        />
      )}
      {isMusicMenuOpen && (
        <div className={styles['music-volume-box']} ref={browserMusicBoxRef}>
          {/* 이전곡/재생/일시정지/다음곡 버튼 - 가로로 나열 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              paddingBottom: '6px',
              paddingTop: '4px',
              borderBottom: '1px solid rgba(255, 212, 59, 0.2)',
            }}
          >
            {/* 이전 곡 */}
            <button
              onClick={handlePreviousTrack}
              disabled={!canGoPrevious}
              style={{
                background: 'none',
                border: 'none',
                cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                color: canGoPrevious ? '#FFD43B' : 'rgba(255, 212, 59, 0.3)',
                fontSize: '1.1rem',
                padding: '5px 6px',
                transition: 'all 0.2s',
              }}
              title="이전 곡"
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            {/* 재생/일시정지 */}
            <button
              onClick={toggleMusic}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FFD43B',
                fontSize: '1.2rem',
                padding: '5px 8px',
                transition: 'all 0.2s',
              }}
              title={isMusicPlaying ? '일시정지' : '재생'}
            >
              <FontAwesomeIcon icon={isMusicPlaying ? faPause : faPlay} />
            </button>

            {/* 다음 곡 */}
            <button
              onClick={handleNextTrack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FFD43B',
                fontSize: '1.1rem',
                padding: '5px 6px',
                transition: 'all 0.2s',
              }}
              title="다음 곡"
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>

          {/* 볼륨 조절 */}
          <div className={styles['music-control-item']}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                width: '100%',
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={handleVolumeChange}
                className={styles['volume-slider']}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  fontSize: '1.4rem',
                  minWidth: '45px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
