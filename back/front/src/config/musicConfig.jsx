/**
 * 타로+우주 감성 배경음악 설정. 서버 대역폭 $0 (브라우저↔CDN 직접). 서버는 URL만 제공, mp3는 CDN 전송.
 * タロット+宇宙感BGM設定。サーバー帯域$0（ブラウザ↔CDN直）。サーバーはURLのみ、mp3はCDN配信。
 * Tarot/cosmic BGM config. Server bandwidth $0 (browser↔CDN direct). Server provides URLs only, CDN serves mp3.
 */

import i18n from '../locales/i18n.js';

// 실제 출력 볼륨 배율 (슬라이더 × 이 값). 2/3 = 3분의 2로 감소
// 実際の出力音量倍率（スライダー×此の値）。2/3で3分の2に低減
// Actual output volume scale (slider × this). 2/3 = two-thirds volume
export const MUSIC_VOLUME_SCALE = 2 / 3;

// 음원 CDN 베이스 URL (env: VITE_MUSIC_CDN_BASE, 미설정 시 Pixabay)
// 音源CDNベースURL（未設定時はPixabay）
// Music CDN base URL (Pixabay if unset)
const MUSIC_CDN_BASE =
  import.meta.env.VITE_MUSIC_CDN_BASE || 'https://cdn.pixabay.com';

// 개발 환경에서만 콘솔 로그 출력
// 開発環境でのみコンソールログ出力
// Log to console in development only
const isDevelopment = import.meta.env.DEV;
const musicLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

// 현재 앱 언어(i18n/URL 기반) - 런타임에서 조회하여 언어 변경에 반응
// 現在のアプリ言語（i18n/URL基準）- ランタイムで取得し言語変更に追従
// Current app language (i18n/URL) - resolved at runtime for language switch
export const getAppLanguage = () => {
  const lang = (
    i18n?.language ||
    (typeof navigator !== 'undefined' ? navigator.language : 'en')
  )
    .toString()
    .toLowerCase();
  return lang.split('-')[0] || 'en';
};

export const isKoAppLanguage = () => getAppLanguage() === 'ko';

export const MUSIC_TRACKS = {
  // 🇰🇷 KO 전용 인트로 트랙 (주석 처리)
  KOREAN_WHISPER: {
    name: '코스모스의 속삭임',
    url:
      import.meta.env.VITE_MUSIC_URL_KOREAN_WHISPER ||
      'https://xkxhm40ix44oinem.public.blob.vercel-storage.com/%EC%BD%94%EC%8A%A4%EB%AA%A8%EC%8A%A4%EC%9D%98%20%EC%86%8D%EC%82%AD%EC%9E%84.m4a',
    description: '🇰🇷 한국어 앱 언어 대상 인트로',
    duration: '미정',
    artist: '',
    source: 'Vercel Blob',
    sourceUrl: '',
  },
  COSMIC_AMBIENT_1: {
    name: 'Cosmic Ambient 1',
    url:
      import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_1 ||
      'https://cdn.pixabay.com/audio/2023/03/21/audio_42a02412dd.mp3',
    description: '✨ 우주적이고 몽환적인 Ambient',
    duration: '미정',
    artist: 'Pixabay Artist',
    source: 'Pixabay',
    sourceUrl: 'https://pixabay.com/music/',
  },
  COSMIC_AMBIENT_2: {
    name: 'Cosmic Ambient 2',
    url: import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_2
      ? import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_2.startsWith('http')
        ? import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_2
        : `${MUSIC_CDN_BASE}${import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_2}`
      : `${MUSIC_CDN_BASE}/audio/2024/03/04/audio_2a5acf3dbc.mp3`,
    description: '🌌 우주적이고 평온한 명상 음악',
    duration: '미정',
    artist: 'Pixabay Artist',
    source: 'Pixabay',
    sourceUrl: 'https://pixabay.com/music/',
  },
  COSMIC_AMBIENT_3: {
    name: 'Cosmic Ambient 3',
    url:
      import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_3 ||
      'https://cdn.pixabay.com/audio/2024/04/28/audio_a181490a98.mp3',
    description: '🔮 신비롭고 차분한 분위기',
    duration: '미정',
    artist: 'Pixabay Artist',
    source: 'Pixabay',
    sourceUrl: 'https://pixabay.com/music/',
  },
  COSMIC_AMBIENT_4: {
    name: 'Cosmic Ambient 4',
    url: import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_4
      ? import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_4.startsWith('http')
        ? import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_4
        : `${MUSIC_CDN_BASE}${import.meta.env.VITE_MUSIC_URL_COSMIC_AMBIENT_4}`
      : `${MUSIC_CDN_BASE}/audio/2024/09/02/audio_c49abe4ef2.mp3`,
    description: '🧘 깊고 평온한 명상 음악',
    duration: '미정',
    artist: 'Pixabay Artist',
    source: 'Pixabay',
    sourceUrl: 'https://pixabay.com/music/',
  },
};

// 기본 음악 선택 (여기만 변경)
// デフォルト楽曲選択（ここだけ変更）
// Default music selection (change here only)
export const DEFAULT_MUSIC = MUSIC_TRACKS.COSMIC_AMBIENT_1;

// 신비롭고 차분한 플레이리스트 (타로 리딩에 최적). 언어는 런타임 변경 가능하므로 함수로 제공
// 神秘で落ち着いたプレイリスト（タロットリーディング向け）。言語はランタイムで変わるため関数で提供
// Mystical, calm playlist (optimized for tarot reading). Function so language can change at runtime
export const getMusicPlaylist = () => {
  return [
    MUSIC_TRACKS.COSMIC_AMBIENT_1,
    MUSIC_TRACKS.COSMIC_AMBIENT_2,
    MUSIC_TRACKS.COSMIC_AMBIENT_3,
    MUSIC_TRACKS.COSMIC_AMBIENT_4,
  ];
};

// 셔플 재생을 위한 상태 관리
// シャッフル再生用の状態管理
// State for shuffle playback
let shuffledPlaylist = [];
let currentIndex = 0;
let hasNavigated = false;
let playlistLangKey = null;

// Fisher-Yates 셔플 알고리즘
// Fisher-Yatesシャッフルアルゴリズム
// Fisher-Yates shuffle algorithm
const shuffleArray = array => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 현재 곡 가져오기 (순서 내 현재 위치). 반환: 현재 음악 트랙
// 現在の曲を取得（順序内の現在位置）。戻り値: 現在の音楽トラック
// Get current track (current position in order). Returns: current music track
export const getCurrentMusic = () => {
  const langKey = getAppLanguage();
  if (playlistLangKey !== langKey) {
    shuffledPlaylist = [];
    currentIndex = 0;
    hasNavigated = false;
    playlistLangKey = langKey;
  }

  const playlist = getMusicPlaylist();

  // 처음 한 번만 셔플 (플레이리스트가 비어있을 때)
  if (shuffledPlaylist.length === 0) {
    // 🇰🇷 KO 전용 첫 곡 고정 로직 주석 처리
    shuffledPlaylist = shuffleArray(playlist);
    currentIndex = 0;
    musicLog(
      '음악 순서 생성! (총 %d곡) - 이 순서로 계속 반복됩니다',
      shuffledPlaylist.length,
    );
  }

  // 인덱스 범위 체크 (순환)
  if (currentIndex < 0) {
    currentIndex = shuffledPlaylist.length - 1;
  } else if (currentIndex >= shuffledPlaylist.length) {
    currentIndex = 0;
  }

  const music = shuffledPlaylist[currentIndex];
  musicLog(
    '재생 중: %d/%d - %s',
    currentIndex + 1,
    shuffledPlaylist.length,
    music.name,
  );

  return music;
};

/**
 * 랜덤 음악 선택 (자동 재생용 - 다음 곡으로 이동)
 * @returns {Object} 다음 음악 트랙
 */
export const getRandomMusic = () => {
  getCurrentMusic(); // 순서 초기화 (필요시)
  currentIndex++; // 다음 곡으로 이동
  hasNavigated = true; // 자동 재생도 이동으로 간주
  return getCurrentMusic();
};

/**
 * 🔄 셔플 상태 초기화 (새로운 랜덤 순서 생성을 위해)
 * 다음 곡 재생 시 새로운 랜덤 순서가 만들어집니다
 */
export const resetShuffle = () => {
  shuffledPlaylist = [];
  currentIndex = 0;
  hasNavigated = false; // 이동 이력 초기화
  playlistLangKey = getAppLanguage();
  musicLog('셔플 상태 초기화 - 다음 곡부터 새로운 순서로 재생됩니다');
};

/**
 * 새로운 랜덤 순서로 즉시 재생
 * 현재 순서를 버리고 새로운 랜덤 순서를 생성합니다
 */
export const reshuffleNow = () => {
  const playlist = getMusicPlaylist();
  // 🇰🇷 KO 전용 첫 곡 고정 로직 주석 처리
  shuffledPlaylist = shuffleArray(playlist);
  currentIndex = 0;
  hasNavigated = false; // 새로운 순서 시작 시 이력 초기화
  playlistLangKey = getAppLanguage();
  musicLog('새로운 랜덤 순서 생성! (총 %d곡)', shuffledPlaylist.length);
  return getCurrentMusic();
};

/**
 * 이전 곡 가져오기 (순서 내에서 뒤로 이동)
 * @returns {Object} 이전 음악 트랙
 */
export const getPreviousMusic = () => {
  // 순서가 없으면 초기화
  if (shuffledPlaylist.length === 0) {
    getCurrentMusic();
  }

  currentIndex--;
  hasNavigated = true; // 이동했음을 표시
  musicLog('이전 곡으로 이동');
  return getCurrentMusic();
};

/**
 * 다음 곡 가져오기 (순서 내에서 앞으로 이동)
 * @returns {Object} 다음 음악 트랙
 */
export const getNextMusicInHistory = () => {
  // 순서가 없으면 초기화
  if (shuffledPlaylist.length === 0) {
    getCurrentMusic();
  }

  currentIndex++;
  hasNavigated = true; // 이동했음을 표시
  musicLog('다음 곡으로 이동');
  return getCurrentMusic();
};

/**
 * 현재 재생 정보 가져오기
 * @returns {Object} { currentIndex, playlistLength, canGoPrevious, canGoNext }
 */
export const getHistoryInfo = () => {
  if (shuffledPlaylist.length === 0) {
    return {
      currentIndex: 0,
      playlistLength: 0,
      canGoPrevious: false,
      canGoNext: false,
    };
  }

  // 순환 재생이므로 이전곡/다음곡 항상 가능
  return {
    currentIndex: currentIndex,
    playlistLength: shuffledPlaylist.length,
    canGoPrevious: true, // 순환 재생 지원
    canGoNext: true, // 순환 재생 지원
  };
};

/**
 * 다음 음악 선택 함수 (순환)
 * @param {Object} currentTrack - 현재 재생 중인 트랙
 * @returns {Object} 다음 트랙
 */
export const getNextMusic = currentTrack => {
  const playlist = getMusicPlaylist();
  if (!currentTrack) return playlist[0];
  console.log('currentTrack', currentTrack);
  const currentIndex = playlist.findIndex(
    track => track.url === currentTrack.url,
  );

  const nextIndex = (currentIndex + 1) % playlist.length;
  return playlist[nextIndex];
};

/**
 * 음악 크레딧 텍스트 생성 함수
 * @param {Object} track - MUSIC_TRACKS의 음악 객체
 * @returns {string} HTML 크레딧 텍스트
 */

export const getMusicCredit = track => {
  if (!track) return '';

  if (track.artist && track.source === 'Pixabay') {
    return `Music by <a href="${track.artistUrl}" target="_blank" rel="noopener noreferrer">${track.artist}</a> from <a href="${track.sourceUrl}" target="_blank" rel="noopener noreferrer">${track.source}</a>`;
  }

  if (track.source === 'Mixkit') {
    return `Music from <a href="${track.sourceUrl}" target="_blank" rel="noopener noreferrer">${track.source}</a>`;
  }

  return '';
};

/**
 * 현재 적용된 6가지 음악 (신나는 + 차분한):
 *
 * 신나는 음악 (Energetic):
 * 1. Epic Cinematic (장엄한 우주) - Pixabay
 * 2. Mystical Adventure (신비한 모험) - Pixabay
 * 3. Cosmic Journey (우주 여행) - Pixabay
 *
 * 차분한 음악 (Calm):
 * 4. Cosmic Dream (우주의 꿈) - Pixabay
 * 5. Mystical Forest (신비로운 숲) - Pixabay
 * 6. Deep Meditation (깊은 명상) - Pixabay
 *
 * 음악 변경 방법:
 * 1. 기본 음악 변경: export const DEFAULT_MUSIC = MUSIC_TRACKS.xxx;
 * 2. 플레이리스트 변경: ENERGETIC_PLAYLIST, CALM_PLAYLIST, MUSIC_PLAYLIST
 * 3. 재생 방식: getRandomMusic, resetShuffle, reshuffleNow, getPreviousMusic, getNextMusicInHistory
 *
 * 재생 흐름: 첫 실행 시 셔플 → 순서대로 재생 → 끝나면 처음부터 반복
 *
 * 서버 대역폭 비용: $0 (사용자가 외부 CDN에서 직접 다운로드)
 * 사용자 데이터: 약 2.5MB/곡 (WiFi 권장)
 *
 * 선곡 기준: 신나는 음악(카드 선택 등), 차분한 음악(해석 대기, 결과 읽기 등)
 */
