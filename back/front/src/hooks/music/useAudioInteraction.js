import { useEffect } from 'react';

/**
 * 브라우저 Autoplay Policy를 우회하기 위한 사용자 상호작용 처리 훅
 *
 * 주요 기능:
 * - 사용자의 첫 상호작용을 감지하여 AudioContext를 활성화
 * - click, touchstart, keydown 이벤트를 모니터링
 * - 한 번만 실행되도록 once 옵션 사용
 * - 메모리 누수 방지를 위한 이벤트 리스너 정리
 */
export const useAudioInteraction = audioContextRef => {
  useEffect(() => {
    /**
     * 사용자의 첫 상호작용을 처리하는 함수
     * - AudioContext가 suspended 상태인 경우 resume 시도
     * - 성공/실패 로그 출력
     */
    const handleFirstInteraction = () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'suspended'
      ) {
        audioContextRef.current
          .resume()
          .then(() => {
            console.log('AudioContext resumed after user interaction');
          })
          .catch(e => {
            console.log('AudioContext resume failed:', e);
          });
      }
    };

    // document 전체에 이벤트 리스너 추가 (한 번만 실행)
    // once: true 옵션으로 자동으로 이벤트 리스너가 제거됨
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, {
      once: true,
    });
    document.addEventListener('keydown', handleFirstInteraction, {
      once: true,
    });

    // cleanup 함수는 once: true 옵션으로 인해 불필요하지만
    // 안전성을 위해 유지 (이미 제거된 이벤트 리스너를 제거하려고 해도 에러 없음)
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [audioContextRef]);
};
