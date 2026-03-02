import { useRef, useCallback, useEffect } from 'react';

/**
 * 크리스탈의 각종 액션들을 관리하는 훅
 *
 * 주요 기능:
 * - 크리스탈의 다양한 액션 상태 관리
 * - 애니메이션 전환 로직 처리
 * - 메모리 누수 방지를 위한 정리 로직
 */
export const useCrystalActions = () => {
  const currentActionRef = useRef(null);

  /**
   * 인사 액션을 실행하는 함수
   * - 중복 실행 방지
   * - 다른 액션들을 페이드아웃하고 인사 액션 시작
   * - 매직 효과 비활성화
   */
  const greetingAction = useCallback(
    (actions, transitionAnimation, setMagicOn) => {
      if (currentActionRef.current === 'greeting') return;
      currentActionRef.current = 'greeting';

      transitionAnimation(actions, 'GreetingAction', 0.7, [
        'MagicAction',
        'WaitingAction',
      ]);

      if (setMagicOn) {
        setMagicOn(false);
        actions?.MagicSetAction?.fadeOut(1);
      }
    },
    []
  );

  /**
   * 매직 액션을 실행하는 함수
   * - 중복 실행 방지
   * - 다른 액션들을 페이드아웃하고 매직 액션 시작
   * - 타이머를 사용한 매직 효과 활성화
   */
  const magicAction = useCallback(
    (actions, transitionAnimation, setMagicOn, setMagicTimer) => {
      if (currentActionRef.current === 'magic') return;
      currentActionRef.current = 'magic';

      transitionAnimation(actions, 'MagicAction', 0.5, [
        'GreetingAction',
        'WaitingAction',
      ]);

      if (setMagicOn) {
        setMagicTimer(() => {
          setMagicOn(true);
          actions?.MagicSetAction?.reset().fadeIn(2).play();
        }, 1500);
      }
    },
    []
  );

  /**
   * 대기 액션을 실행하는 함수
   * - 중복 실행 방지
   * - 다른 액션들을 페이드아웃하고 대기 액션 시작
   * - 매직 효과 비활성화
   */
  const waitingAction = useCallback(
    (actions, transitionAnimation, setMagicOn) => {
      if (currentActionRef.current === 'waiting') return;
      currentActionRef.current = 'waiting';

      transitionAnimation(actions, 'WaitingAction', 0.5, [
        'GreetingAction',
        'MagicAction',
      ]);

      if (setMagicOn) {
        setMagicOn(false);
        actions?.MagicSetAction?.fadeOut(1);
      }
    },
    []
  );

  /**
   * 액션 시퀀스를 실행하는 함수
   * - 인사 액션 먼저 실행
   * - 8초 후 매직 액션 실행
   */
  const executeSequence = useCallback(
    (actions, greetingAction, magicAction, setTimer) => {
      greetingAction(actions);
      setTimer(() => magicAction(actions), 8000);
    },
    []
  );

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      currentActionRef.current = null;
    };
  }, []);

  return {
    currentActionRef,
    greetingAction,
    magicAction,
    waitingAction,
    executeSequence,
  };
};
