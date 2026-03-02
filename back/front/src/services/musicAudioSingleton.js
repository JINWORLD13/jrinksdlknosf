/**
 * 전역(세션 내) 단일 HTMLAudioElement 관리
 *
 * 문제 배경:
 * - React 리마운트/하이드레이션 실패 후 재렌더 등으로 MusicPlayer가 2번 초기화되면
 *   new Audio()가 여러 개 생겨 "겹쳐서 재생"될 수 있음.
 *
 * 해결:
 * - 앱 전체에서 항상 하나의 Audio 인스턴스만 재사용.
 */

let singletonAudio = null;

/**
 * 싱글톤 Audio를 가져옵니다.
 * @param {Object} [options]
 * @param {boolean} [options.create=true] - 없을 때 새로 만들지 여부
 * @returns {HTMLAudioElement|null}
 */
export const getMusicAudio = (options = {}) => {
  const { create = true } = options;
  if (!singletonAudio && create) {
    singletonAudio = new Audio();
  }
  return singletonAudio;
};

/**
 * 싱글톤 Audio를 완전히 정리합니다.
 * - pause
 * - src 초기화
 * - reference 해제
 */
export const destroyMusicAudio = () => {
  if (!singletonAudio) return;
  try {
    singletonAudio.pause();
    singletonAudio.src = '';
    // 일부 브라우저는 src='' 이후 load()로 버퍼를 더 확실히 해제할 수 있음
    if (typeof singletonAudio.load === 'function') {
      singletonAudio.load();
    }
  } catch {
    // ignore
  } finally {
    singletonAudio = null;
  }
};


