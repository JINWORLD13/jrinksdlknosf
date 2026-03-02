import { useRef, useCallback, useEffect } from 'react';

/**
 * 크리스탈 액션의 실행 로직을 관리하는 훅
 */
export const useCrystalActionLogic = (
  initialActions,
  isTarotAnswerWaitingState,
  isTarotAnsweredState,
  isReadyToShowDurumagiState,
  setMagicOn,
  transitionAnimation,
  greetingAction,
  magicAction,
  waitingAction,
  executeSequence,
  clearAllTimers,
  setTimer,
  intervalRef
) => {
  const actionsRef = useRef(initialActions);

  // 액션 참조 업데이트
  useEffect(() => {
    actionsRef.current = initialActions;
    return () => {
      actionsRef.current = null;
    };
  }, [initialActions]);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const crystalAction = useCallback(() => {
    const actions = actionsRef.current;

    // 기존 타이머들 정리
    clearAllTimers();

    if (
      isTarotAnswerWaitingState ||
      (!isReadyToShowDurumagiState && isTarotAnsweredState)
    ) {
      waitingAction(actions, transitionAnimation, setMagicOn);
    } else {
      executeSequence(
        actions,
        () => greetingAction(actions, transitionAnimation, setMagicOn),
        () => magicAction(actions, transitionAnimation, setMagicOn, setTimer),
        setTimer
      );
    }

    // 크리스탈 볼 내부 빛 효과
    actions?.LightInCrystalBallAction?.play();
  }, [
    isTarotAnswerWaitingState,
    isTarotAnsweredState,
    isReadyToShowDurumagiState,
    setMagicOn,
    transitionAnimation,
    greetingAction,
    magicAction,
    waitingAction,
    executeSequence,
    clearAllTimers,
    setTimer,
  ]);

  // 크리스탈 액션 실행 및 인터벌 설정
  useEffect(() => {
    if (!isReadyToShowDurumagiState && isTarotAnsweredState) return;

    crystalAction();

    // 인터벌 설정 (이미 설정되지 않은 경우에만)
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (
          !isTarotAnswerWaitingState &&
          !(isTarotAnsweredState && !isReadyToShowDurumagiState)
        ) {
          crystalAction();
        }
      }, 13000);
    }

    return () => {
      clearAllTimers();
    };
  }, [
    crystalAction,
    isReadyToShowDurumagiState,
    isTarotAnsweredState,
    isTarotAnswerWaitingState,
    intervalRef,
    clearAllTimers,
  ]);

  return {
    actionsRef,
    crystalAction,
  };
};
