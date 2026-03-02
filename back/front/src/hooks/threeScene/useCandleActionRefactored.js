import { useCandleActionInitializer } from './useCandleActionInitializer';
import { useCandleStateManager } from './useCandleStateManager';
import { useCandleAnimationLogic } from './useCandleAnimationLogic';
import { useCandleActionExecutor } from './useCandleActionExecutor';

/**
 * 리팩토링된 캔들 액션 훅
 * 기존의 복잡한 로직을 여러 개의 작은 훅으로 분리
 */
export const useCandleActionRefactored = (
  initializedActions,
  time,
  WindowLeftDoorActionState,
  WindowRightDoorActionState,
  leftDoorClick,
  rightDoorClick,
  isWaiting
) => {
  // 각 기능별 훅들
  const { actionsRef, timeoutIdRef } = useCandleActionInitializer(
    initializedActions,
    isWaiting
  );

  const {
    getCandleActions,
    playAllCandles,
    stopAllCandles,
    playAllWindowCandles,
    stopAllWindowCandles,
    fadeOutAllWindowCandles,
  } = useCandleStateManager();

  const { handleBothDoorsOpen, handleBothDoorsClosed, handlePartialDoorState } =
    useCandleAnimationLogic(
      playAllCandles,
      stopAllCandles,
      playAllWindowCandles,
      stopAllWindowCandles,
      fadeOutAllWindowCandles
    );

  const { candleAction } = useCandleActionExecutor(
    actionsRef,
    timeoutIdRef,
    time,
    WindowLeftDoorActionState,
    WindowRightDoorActionState,
    leftDoorClick,
    rightDoorClick,
    isWaiting,
    getCandleActions,
    playAllCandles,
    stopAllCandles,
    playAllWindowCandles,
    stopAllWindowCandles,
    fadeOutAllWindowCandles,
    handleBothDoorsOpen,
    handleBothDoorsClosed,
    handlePartialDoorState
  );

  return null; // 기존과 동일하게 null 반환
};
