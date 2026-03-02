import { useCallback, useEffect } from 'react';

/**
 * 캔들 액션 실행을 관리하는 훅
 */
export const useCandleActionExecutor = (
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
) => {
  const candleAction = useCallback(() => {
    const actions = actionsRef.current;
    const candleActions = getCandleActions(actions);

    if (WindowLeftDoorActionState && WindowRightDoorActionState) {
      handleBothDoorsOpen(
        candleActions,
        time,
        timeoutIdRef,
        playAllCandles,
        stopAllWindowCandles
      );
    } else if (!WindowLeftDoorActionState && !WindowRightDoorActionState) {
      handleBothDoorsClosed(
        candleActions,
        leftDoorClick,
        rightDoorClick,
        playAllCandles,
        stopAllCandles,
        playAllWindowCandles
      );
    } else {
      handlePartialDoorState(
        candleActions,
        WindowLeftDoorActionState,
        WindowRightDoorActionState,
        leftDoorClick,
        rightDoorClick,
        time,
        timeoutIdRef,
        stopAllCandles,
        playAllWindowCandles,
        fadeOutAllWindowCandles,
        playAllCandles,
        stopAllWindowCandles
      );
    }
  }, [
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
    handlePartialDoorState,
  ]);

  useEffect(() => {
    candleAction();
  }, [candleAction, isWaiting]);

  return {
    candleAction,
  };
};
