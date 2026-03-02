import { useRef, useCallback, useEffect } from 'react';
import { MUSIC_VOLUME_SCALE } from '@/config/musicConfig';

// 전역(세션 내) 단일 Audio 인스턴스 + 간단 ref-count
let sharedHTMLAudio = null;
let sharedHTMLAudioUsers = 0;

const acquireSharedHTMLAudio = () => {
  if (!sharedHTMLAudio) {
    sharedHTMLAudio = new Audio();
  }
  sharedHTMLAudioUsers += 1;
  return sharedHTMLAudio;
};

const releaseSharedHTMLAudio = () => {
  sharedHTMLAudioUsers = Math.max(0, sharedHTMLAudioUsers - 1);
  if (sharedHTMLAudioUsers === 0 && sharedHTMLAudio) {
    try {
      sharedHTMLAudio.pause();
      sharedHTMLAudio.src = '';
      if (typeof sharedHTMLAudio.load === 'function') {
        sharedHTMLAudio.load();
      }
    } catch {
      // ignore
    }
    sharedHTMLAudio = null;
  }
};

/**
 * HTML Audio 요소를 관리하는 훅
 *
 * 주요 기능:
 * - HTML Audio 요소 생성 및 관리
 * - 배경음악 재생/일시정지/볼륨 조절
 * - Autoplay Policy 대응을 위한 재시도 로직
 * - 메모리 누수 방지를 위한 정리 로직
 */
export const useHTMLAudio = () => {
  const audioRef = useRef(null);

  /**
   * HTML Audio 요소를 설정하는 함수
   * - Audio 객체가 없으면 새로 생성
   * - 루프 재생 활성화
   * - 소스와 볼륨 설정
   */
  const setupHTMLAudio = useCallback((musicSource, musicVolume) => {
    const scaledVolume = musicVolume * MUSIC_VOLUME_SCALE;
    if (!audioRef.current) {
      const audio = acquireSharedHTMLAudio();
      audio.loop = true;
      audio.volume = scaledVolume;
      audioRef.current = audio;
    }

    // 소스와 볼륨 설정
    audioRef.current.src = musicSource;
    audioRef.current.volume = scaledVolume;
  }, []);

  /**
   * HTML Audio를 재생하는 함수
   * - Autoplay Policy로 인한 실패 시 사용자 상호작용 대기
   * - 재시도 로직 포함
   */
  const playHTMLAudio = useCallback(() => {
    if (!audioRef.current) return;

    const playAudio = () => {
      audioRef.current.play().catch(e => {
        console.log('Audio play failed, waiting for user interaction:', e);
        // 첫 클릭 시 재생 시도
        const retryPlay = () => {
          audioRef.current
            .play()
            .catch(err => console.log('Retry failed:', err));
          document.removeEventListener('click', retryPlay);
        };
        document.addEventListener('click', retryPlay, { once: true });
      });
    };
    playAudio();
  }, []);

  /**
   * HTML Audio를 일시정지하는 함수
   */
  const pauseHTMLAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  /**
   * HTML Audio의 볼륨을 설정하는 함수
   * @param {number} volume - 볼륨 값 (0.0 ~ 1.0)
   */
  const setHTMLAudioVolume = useCallback(volume => {
    if (audioRef.current) {
      const scaled = Math.max(0, Math.min(1, volume)) * MUSIC_VOLUME_SCALE;
      audioRef.current.volume = scaled;
    }
  }, []);

  /**
   * HTML Audio 리소스를 정리하는 함수
   * - 컴포넌트 언마운트 시 호출되어 메모리 누수 방지
   */
  const cleanupHTMLAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // 메모리 해제를 위해 src 초기화
      audioRef.current = null;
    }
    releaseSharedHTMLAudio();
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupHTMLAudio();
    };
  }, [cleanupHTMLAudio]);

  return {
    audioRef,
    setupHTMLAudio,
    playHTMLAudio,
    pauseHTMLAudio,
    setHTMLAudioVolume,
    cleanupHTMLAudio,
  };
};
