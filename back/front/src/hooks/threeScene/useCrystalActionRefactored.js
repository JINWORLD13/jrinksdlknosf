import { useAnimationTimers } from './useAnimationTimers';
import { useAnimationTransitions } from './useAnimationTransitions';
import { useCrystalActions } from './useCrystalActions';
import { useCrystalActionLogic } from './useCrystalActionLogic';

/**
 * 리팩토링된 크리스탈 액션 훅
 * 기존의 복잡한 로직을 여러 개의 작은 훅으로 분리
 */
export const useCrystalActionRefactored = (
  initialActions,
  isTarotAnswerWaitingState,
  isTarotAnsweredState,
  isReadyToShowDurumagiState,
  setMagicOn = undefined
) => {
  // 각 기능별 훅들
  const {
    setTimer,
    setMagicTimer,
    setIntervalTimer,
    clearAllTimers,
    intervalRef,
  } = useAnimationTimers();

  const { transitionAnimation } = useAnimationTransitions();

  const { greetingAction, magicAction, waitingAction, executeSequence } =
    useCrystalActions();

  const { crystalAction } = useCrystalActionLogic(
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
  );

  return null; // 기존과 동일하게 null 반환
};
