import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setIsMusicPlaying,
  setMusicVolume,
  setMusicSource,
} from '../../store/booleanStore.jsx';
import {
  saveMusicVolume,
  saveMusicPlayingState,
  saveMusicSource,
} from '../../utils/storage/musicPreference.jsx';
import {
  getPreviousMusic,
  getNextMusicInHistory,
  getHistoryInfo,
} from '../../config/musicConfig.jsx';
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';

/**
 * 음악 제어 로직을 처리하는 커스텀 훅
 * @returns {Object} { isMusicPlaying, musicVolume, needsInteraction, toggleMusic, handleVolumeChange, getVolumeIcon, handleIconClick }
 */
const useMusicControl = () => {
  const dispatch = useDispatch();
  const isMusicPlaying = useSelector(
    state => state.booleanStore.isMusicPlaying
  );
  const musicVolume = useSelector(state => state.booleanStore.musicVolume);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const previousVolumeRef = useRef(null); // 이전 볼륨 저장 (초기값 null)

  // 볼륨이 0보다 크면 이전 볼륨 저장
  useEffect(() => {
    if (musicVolume > 0) {
      previousVolumeRef.current = musicVolume;
    }
  }, [musicVolume]);

  // 가로/세로 모드 감지
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // 사용자 상호작용 필요 여부 체크
  useEffect(() => {
    const hasInteracted = localStorage.getItem('hasInteractedWithMusic');
    if (!hasInteracted && isMusicPlaying && musicVolume > 0) {
      setNeedsInteraction(true);
    }

    // 첫 클릭 시 펄스 애니메이션 제거
    const handleFirstClick = () => {
      setNeedsInteraction(false);
      localStorage.setItem('hasInteractedWithMusic', 'true');
    };

    document.addEventListener('click', handleFirstClick, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [isMusicPlaying, musicVolume]);

  // 음악 토글
  const toggleMusic = () => {
    const newPlayingState = !isMusicPlaying;
    dispatch(setIsMusicPlaying(newPlayingState));
    saveMusicPlayingState(newPlayingState);
  };

  // 음량 조절
  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setMusicVolume(newVolume));
    saveMusicVolume(newVolume);

    // 볼륨이 0보다 크면 자동으로 음악 켜기
    if (newVolume > 0 && !isMusicPlaying) {
      dispatch(setIsMusicPlaying(true));
      saveMusicPlayingState(true);
    }
    // 볼륨이 0이 되어도 음악은 계속 재생 (음소거 상태)
  };

  // 볼륨에 따른 아이콘 결정
  const getVolumeIcon = () => {
    if (musicVolume === 0 || !isMusicPlaying) {
      return faVolumeXmark;
    } else if (musicVolume > 0 && musicVolume < 0.5) {
      return faVolumeLow;
    } else {
      return faVolumeHigh;
    }
  };

  // 스피커 아이콘 클릭 핸들러
  const handleSpeakerIconClick = (isMusicMenuOpen, setMusicMenuOpen) => {
    if (isMusicMenuOpen) {
      // 볼륨창이 열려있는 경우: 닫고 음소거
      setMusicMenuOpen(false);
      if (musicVolume > 0) {
        previousVolumeRef.current = musicVolume; // 현재 볼륨 저장
      }
      dispatch(setMusicVolume(0));
      saveMusicVolume(0);
      dispatch(setIsMusicPlaying(false));
      saveMusicPlayingState(false);
    } else {
      // 볼륨창이 닫혀있는 경우
      if (musicVolume === 0) {
        // 음소거 상태면: 볼륨창 열고 이전 볼륨으로 복원 (이전 기록 없으면 50%)
        const restoredVolume =
          previousVolumeRef.current && previousVolumeRef.current > 0
            ? previousVolumeRef.current
            : 0.5;
        dispatch(setMusicVolume(restoredVolume));
        saveMusicVolume(restoredVolume);
        dispatch(setIsMusicPlaying(true));
        saveMusicPlayingState(true);
      }
      // 볼륨창 열기
      setMusicMenuOpen(true);
    }
  };

  // 이전 곡 재생
  const handlePreviousTrack = () => {
    const previousMusic = getPreviousMusic();
    if (previousMusic) {
      dispatch(setMusicSource(previousMusic.url));
      saveMusicSource(previousMusic.url);
      // 재생 중이었다면 계속 재생, 아니면 재생 시작
      dispatch(setIsMusicPlaying(true));
      saveMusicPlayingState(true);
    }
  };

  // 다음 곡 재생
  const handleNextTrack = () => {
    const nextMusic = getNextMusicInHistory();
    if (nextMusic) {
      dispatch(setMusicSource(nextMusic.url));
      saveMusicSource(nextMusic.url);
      // 재생 중이었다면 계속 재생, 아니면 재생 시작
      dispatch(setIsMusicPlaying(true));
      saveMusicPlayingState(true);
    }
  };

  // 이력 정보 가져오기
  const historyInfo = getHistoryInfo();

  return {
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
    canGoPrevious: historyInfo.canGoPrevious,
    canGoNext: historyInfo.canGoNext,
  };
};

export default useMusicControl;
