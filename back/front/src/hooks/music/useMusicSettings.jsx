import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import store from '../../store/store.jsx';
import { Capacitor } from '@capacitor/core';
import {
  setIsMusicPlaying,
  setMusicVolume,
  setMusicSource,
} from '../../store/booleanStore.jsx';
import {
  getMusicVolume,
  getMusicSource,
  getMusicPlayingState,
  saveMusicSource,
} from '../../utils/storage/musicPreference.jsx';
import {
  getCurrentMusic,
  isKoAppLanguage,
  MUSIC_TRACKS,
} from '../../config/musicConfig.jsx';

/**
 * 음악 설정을 불러오고 Redux 스토어에 저장하는 커스텀 훅
 * @returns {boolean} isMusicSettingsLoaded - 음악 설정 로딩 완료 여부
 */
const useMusicSettings = () => {
  const dispatch = useDispatch();
  const [isMusicSettingsLoaded, setIsMusicSettingsLoaded] = useState(false);

  useEffect(() => {
    const loadMusicSettings = async () => {
      try {
        // Redux 스토어에서 현재 음악 소스 확인 (페이지 이동 시에도 유지)
        const currentMusicSourceInRedux = store.getState().booleanStore.musicSource;

        // 저장된 음악 설정 불러오기
        const volume = await getMusicVolume();
        const source = await getMusicSource();
        const isPlaying = await getMusicPlayingState();
        const isNative = Capacitor.isNativePlatform();
        const hasInteracted = localStorage.getItem('hasInteractedWithMusic');

        // Redux 스토어에 볼륨 설정
        dispatch(setMusicVolume(volume));

        // 재생 상태 설정
        // - 네이티브 앱: 저장된 상태 사용 (기본값: true)
        // - 브라우저 (처음 방문): 사용자 클릭 대기 (false)
        // - 브라우저 (재방문): 저장된 상태 사용
        let shouldPlay = isPlaying;
        if (!isNative && !hasInteracted) {
          // 브라우저 첫 방문: 사용자 클릭 후 재생 시작
          shouldPlay = false;
        }
        dispatch(setIsMusicPlaying(shouldPlay));

        // 타로+우주 테마 음악 설정 (대역폭 비용 $0)
        // 요구사항:
        // - (i18n 언어 기준) ko일 때만 m4a 인트로를 "추가적으로" 처음에 들리게
        // - 세션당 1회만 강제
        // - en/ja로 바꿨을 때 저장된 인트로 소스가 계속 재생되지 않도록 정리
        const koIntroUrl = MUSIC_TRACKS.KOREAN_WHISPER?.url;
        const isKo = isKoAppLanguage();

        const shouldIgnoreStoredKoIntro =
          !isNative && !isKo && koIntroUrl && source === koIntroUrl;
        const effectiveSource = shouldIgnoreStoredKoIntro ? null : source;
        if (shouldIgnoreStoredKoIntro) {
          await saveMusicSource(null);
        }

        const shouldForceKoIntro =
          !isNative &&
          isKo &&
          koIntroUrl &&
          sessionStorage.getItem('koIntroPlayed') !== 'true';

        // 페이지 이동 시에도 현재 재생 중인 음악 유지
        // Redux 스토어에 이미 음악 소스가 있으면 그것을 유지하고 새로운 음악을 선택하지 않음
        if (!currentMusicSourceInRedux) {
          // Redux에 음악 소스가 없을 때만 새로운 음악 선택
          let musicUrl;
          
          if (shouldForceKoIntro) {
            // KO 인트로 강제 재생
            musicUrl = koIntroUrl;
            sessionStorage.setItem('koIntroPlayed', 'true');
          } else if (effectiveSource) {
            // 저장된 음악 소스 사용
            musicUrl = effectiveSource;
          } else {
            // 저장된 소스가 없을 때만 새로운 음악 선택
            const music = getCurrentMusic();
            musicUrl = music.url;
          }

          dispatch(setMusicSource(musicUrl));
        }
        // Redux에 이미 음악 소스가 있으면 아무것도 하지 않음 (현재 재생 중인 음악 유지)

        // 브라우저 첫 방문: 사용자 클릭 시 자동으로 음악 켜기
        if (!isNative && !hasInteracted && volume > 0) {
          const handleFirstInteraction = () => {
            dispatch(setIsMusicPlaying(true));
            localStorage.setItem('hasInteractedWithMusic', 'true');
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          };
          document.addEventListener('click', handleFirstInteraction, {
            once: true,
          });
          document.addEventListener('touchstart', handleFirstInteraction, {
            once: true,
          });
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 음악 변경 방법:
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //
        // src/config/musicConfig.jsx 파일에서 music만 변경하면 됩니다!
        //
        // 여러 무료 음악 옵션이 준비되어 있습니다:
        // - COSMIC_AMBIENT_1: 신비로운 타로 (기본값)
        // - MYSTICAL_TAROT_1: 신비로운 타로
        // - COSMIC_JOURNEY: 우주 여행
        // - ETHEREAL_MEDITATION: 에테르 명상
        //
        // 💰 모든 음악이 무료 CDN에서 제공되어 서버 비용 $0
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        // 설정 로드 완료
        setIsMusicSettingsLoaded(true);
      } catch (error) {
        console.error('Failed to load music settings:', error);
        // 에러가 나도 일단 로드 완료로 표시
        setIsMusicSettingsLoaded(true);
      }
    };

    loadMusicSettings();
  }, [dispatch]);

  return isMusicSettingsLoaded;
};

export default useMusicSettings;
