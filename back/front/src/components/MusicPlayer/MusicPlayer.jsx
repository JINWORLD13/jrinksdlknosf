import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import i18n from '../../locales/i18n.js';
import {
  destroyMusicAudio,
  getMusicAudio,
} from '../../services/musicAudioSingleton.js';
import {
  setMusicSource,
  setIsMusicPlaying,
} from '../../store/booleanStore.jsx';
import {
  saveMusicSource,
  saveMusicPlayingState,
} from '../../utils/storage/musicPreference.jsx';
import {
  getCurrentMusic,
  getNextMusicInHistory,
  MUSIC_TRACKS,
  MUSIC_VOLUME_SCALE,
  resetShuffle,
} from '../../config/musicConfig.jsx';

// 개발 환경에서만 콘솔 로그 출력
// 開発環境でのみコンソールログ出力
// Log to console in development only
const isDevelopment = import.meta.env.DEV;
const musicLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const isMusicPlaying = useSelector(
    state => state.booleanStore.isMusicPlaying,
  );
  const musicVolume = useSelector(state => state.booleanStore.musicVolume);
  const musicSource = useSelector(state => state.booleanStore.musicSource);

  // HTML Audio 태그 (mp3/URL - CDN 음악만 재생)
  // HTML Audioタグ（mp3/URL - CDN音楽のみ再生）
  // HTML Audio element (mp3/URL - CDN music only)
  const audioRef = useRef(null);

  // 에러 카운트 (무한 루프 방지)
  // エラーカウント（無限ループ防止）
  // Error count (prevent infinite loop)
  const errorCountRef = useRef(0);
  const MAX_RETRY = 3; // 최대 3곡까지만 연속 시도

  // 현재 로드된 음악 소스 추적 (src 재설정 방지용)
  const currentSourceRef = useRef(null);

  // 백그라운드에서 재생 중이었는지 추적 (포그라운드 복귀 시 자동 재생용)
  const wasPlayingBeforeBackgroundRef = useRef(false);

  // 로드 timeout 추적
  const loadTimeoutRef = useRef(null);

  // 곡이 끝났을 때 자동으로 다음 곡 재생
  const handleTrackEnded = useCallback(() => {
    musicLog('Track ended - playing next track');
    // 재생 중이었으면 다음 곡도 계속 재생되도록 보장
    if (!isMusicPlaying) {
      musicLog('Not playing, skipping next track');
      return;
    }
    const nextMusic = getNextMusicInHistory();
    if (nextMusic) {
      dispatch(setMusicSource(nextMusic.url));
      saveMusicSource(nextMusic.url);
      // isMusicPlaying이 true인 상태이므로 다음 곡도 자동 재생됨
    } else {
      musicLog('No next track available');
    }
  }, [dispatch, isMusicPlaying]);

  // 에러 발생 시 다음 곡으로 자동 넘어가기 (404, 네트워크 에러 등)
  const handleAudioError = useCallback(() => {
    errorCountRef.current++;

    if (audioRef.current?.error) {
      const error = audioRef.current.error;
      const errorMessages = {
        1: 'MEDIA_ERR_ABORTED: 사용자가 중단',
        2: 'MEDIA_ERR_NETWORK: 네트워크 에러',
        3: 'MEDIA_ERR_DECODE: 디코딩 에러',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED: 404 Not Found / 지원하지 않는 포맷',
      };
      musicLog(
        `Music load failed (${errorCountRef.current}/${MAX_RETRY}):`,
        errorMessages[error.code] || error.code,
      );
    }

    // 연속 에러가 최대 재시도 횟수를 초과하면 음악 재생 중단
    if (errorCountRef.current >= MAX_RETRY) {
      musicLog('Consecutive errors occurred, stopping playback');
      dispatch(setIsMusicPlaying(false));
      saveMusicPlayingState(false);
      errorCountRef.current = 0;
      return;
    }

    // 다음 곡으로 자동 넘어가기
    musicLog('Automatically skipping to next track...');
    const nextMusic = getNextMusicInHistory();
    if (nextMusic) {
      dispatch(setMusicSource(nextMusic.url));
      saveMusicSource(nextMusic.url);
    }
  }, [dispatch]);

  // 성공적으로 재생 시작되면 에러 카운트 리셋
  const handleAudioPlaying = useCallback(() => {
    if (errorCountRef.current > 0) {
      musicLog('Music playback successful - resetting error count');
      errorCountRef.current = 0;
    }
  }, []);

  // 언어 설정 변경 시: KO 전용 인트로가 EN/JA에서도 계속 재생되는 문제 방지
  useEffect(() => {
    const koIntroUrl = MUSIC_TRACKS.KOREAN_WHISPER?.url;
    if (!koIntroUrl) return;

    const handleLanguageChanged = newLang => {
      const lang = (newLang || i18n.language || '')
        .toString()
        .toLowerCase()
        .split('-')[0];

      // EN/JA로 바뀌었는데 KO 인트로가 재생 중이면, 해당 언어 플레이리스트의 첫 곡으로 즉시 교체
      if (lang !== 'ko' && musicSource === koIntroUrl) {
        resetShuffle();
        const next = getCurrentMusic();
        dispatch(setMusicSource(next.url));
        saveMusicSource(next.url);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [dispatch, musicSource]);

  // 컴포넌트가 완전히 언마운트될 때는 오디오를 확실히 정리 (겹침 재생 방지)
  useEffect(() => {
    return () => {
      destroyMusicAudio();
      audioRef.current = null;
      currentSourceRef.current = null;
    };
  }, []);

  // 음악 소스 변경 시 리셋
  useEffect(() => {
    if (musicSource) {
      // HTML Audio 준비
      if (!audioRef.current) {
        const audio = getMusicAudio({ create: true });
        audio.loop = false; // 반복 재생 비활성화 (곡 끝나면 자동으로 다음 곡)
        audio.volume = musicVolume * MUSIC_VOLUME_SCALE;
        audioRef.current = audio;
      }

      // musicSource가 실제로 변경된 경우에만 src 재설정
      const sourceChanged = currentSourceRef.current !== musicSource;
      if (sourceChanged) {
        // src 변경 전 pause로 일부 환경(WebView)에서의 순간 겹침 방지
        try {
          audioRef.current.pause();
        } catch {
          // ignore
        }
        audioRef.current.src = musicSource;
        audioRef.current.loop = false; // 반복 재생 비활성화
        currentSourceRef.current = musicSource; // 현재 소스 업데이트
        musicLog('Music source changed:', musicSource);
      }

      // 이벤트 리스너 등록
      const audio = audioRef.current;

      // 곡이 끝났을 때
      audio.removeEventListener('ended', handleTrackEnded);
      audio.addEventListener('ended', handleTrackEnded);

      // 에러 발생 시 (404, 네트워크 에러 등)
      audio.removeEventListener('error', handleAudioError);
      audio.addEventListener('error', handleAudioError);

      // 재생 성공 시 (에러 카운트 리셋용)
      audio.removeEventListener('playing', handleAudioPlaying);
      audio.addEventListener('playing', handleAudioPlaying);

      // 소스가 변경되었고 재생 중이면 자동 재생
      if (sourceChanged && isMusicPlaying) {
        // 오디오가 로드될 때까지 기다린 후 재생
        const playAudio = () => {
          const audio = audioRef.current;
          if (!audio) return;

          // 이미 로드되었으면 바로 재생
          if (audio.readyState >= 3) {
            audio.play().catch(e => {
              musicLog('Audio play failed, waiting for user interaction:', e);
              const retryPlay = () => {
                if (audioRef.current && isMusicPlaying) {
                  audioRef.current
                    .play()
                    .catch(err => musicLog('Retry failed:', err));
                }
                document.removeEventListener('click', retryPlay);
              };
              document.addEventListener('click', retryPlay, { once: true });
            });
          } else {
            // 로드될 때까지 대기 (리스너 관리 개선)
            const onCanPlay = () => {
              if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
                loadTimeoutRef.current = null;
              }
              if (!audioRef.current || !isMusicPlaying) return;
              audioRef.current.play().catch(e => {
                musicLog('Audio play failed, waiting for user interaction:', e);
                const retryPlay = () => {
                  if (audioRef.current && isMusicPlaying) {
                    audioRef.current
                      .play()
                      .catch(err => musicLog('Retry failed:', err));
                  }
                  document.removeEventListener('click', retryPlay);
                };
                document.addEventListener('click', retryPlay, { once: true });
              });
            };
            // 기존 리스너 제거 후 새로 추가
            audio.removeEventListener('canplay', onCanPlay);
            audio.addEventListener('canplay', onCanPlay, { once: true });

            // 로드 실패 대비: timeout 후에도 재생 시도
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
            loadTimeoutRef.current = setTimeout(() => {
              loadTimeoutRef.current = null;
              if (
                audioRef.current &&
                audioRef.current.readyState >= 2 &&
                isMusicPlaying
              ) {
                audioRef.current
                  .play()
                  .catch(e => musicLog('Timeout play failed:', e));
              }
            }, 5000);
          }
        };
        playAudio();
      }
    } else {
      // musicSource가 없으면 재생하지 않음 (Web Audio API 사용 안 함)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        currentSourceRef.current = null;
      }
      musicLog('No music source available. Playing CDN music only.');
    }

    return () => {
      // timeout 정리
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.removeEventListener('ended', handleTrackEnded);
        audio.removeEventListener('error', handleAudioError);
        audio.removeEventListener('playing', handleAudioPlaying);
        // NOTE: 실제 종료는 "컴포넌트 언마운트"에서만 처리 (ref-count 기반)
      }
    };
  }, [
    musicSource,
    isMusicPlaying,
    handleTrackEnded,
    handleAudioError,
    handleAudioPlaying,
    musicVolume,
  ]);

  // 재생/정지
  useEffect(() => {
    if (musicSource && audioRef.current) {
      // HTML Audio 제어 (CDN 음악만)
      if (isMusicPlaying) {
        audioRef.current.play().catch(e => {
          musicLog('Audio play failed, waiting for user interaction:', e);
          // 첫 클릭 시 재생 시도
          const retryPlay = () => {
            audioRef.current
              .play()
              .catch(err => musicLog('Retry failed:', err));
            document.removeEventListener('click', retryPlay);
          };
          document.addEventListener('click', retryPlay, { once: true });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying, musicSource]);

  // 음량 조절
  useEffect(() => {
    if (musicSource && audioRef.current) {
      audioRef.current.volume = musicVolume * MUSIC_VOLUME_SCALE;
    }
  }, [musicVolume, musicSource]);

  // 브라우저 백그라운드 감지 (Page Visibility API - 웹 브라우저 전용)
  useEffect(() => {
    // 웹 브라우저에서만 실행 (네이티브 앱 제외)
    if (Capacitor.isNativePlatform()) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 탭이 백그라운드로 갈 때 - 음악 일시정지
        musicLog('Browser moved to background - pausing music');
        if (audioRef.current && !audioRef.current.paused) {
          wasPlayingBeforeBackgroundRef.current = true;
          audioRef.current.pause();
        } else {
          wasPlayingBeforeBackgroundRef.current = false;
        }
      } else {
        // 탭이 다시 포그라운드로 올 때 - 이전에 재생 중이었으면 다시 재생
        musicLog('Browser returned to foreground');
        if (
          audioRef.current &&
          wasPlayingBeforeBackgroundRef.current &&
          isMusicPlaying
        ) {
          musicLog('Resuming music playback');
          audioRef.current.play().catch(e => {
            musicLog('Resume play failed:', e);
          });
        }
        wasPlayingBeforeBackgroundRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // cleanup: 이벤트 리스너 제거
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMusicPlaying]);

  // 앱 라이프사이클 이벤트 리스너 (네이티브 앱 전용)
  useEffect(() => {
    // 네이티브 앱에서만 실행
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let pauseListener;
    let resumeListener;

    const setupListeners = async () => {
      // 백그라운드로 갈 때 - 음악 일시정지
      pauseListener = await App.addListener('pause', () => {
        musicLog('App moved to background - pausing music');
        if (audioRef.current && !audioRef.current.paused) {
          wasPlayingBeforeBackgroundRef.current = true;
          audioRef.current.pause();
        } else {
          wasPlayingBeforeBackgroundRef.current = false;
        }
      });

      // 포그라운드로 돌아올 때 - 이전에 재생 중이었으면 다시 재생
      resumeListener = await App.addListener('resume', () => {
        musicLog('App returned to foreground');
        if (
          audioRef.current &&
          wasPlayingBeforeBackgroundRef.current &&
          isMusicPlaying
        ) {
          musicLog('Resuming music playback');
          audioRef.current.play().catch(e => {
            musicLog('Resume play failed:', e);
          });
        }
        wasPlayingBeforeBackgroundRef.current = false;
      });
    };

    setupListeners();

    // cleanup: 이벤트 리스너 제거
    return () => {
      if (pauseListener) pauseListener.remove();
      if (resumeListener) resumeListener.remove();
    };
  }, [isMusicPlaying]);

  return null; // UI는 Navbar에서 처리
};

export default MusicPlayer;
