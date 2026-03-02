import { useCallback } from 'react';

/**
 * 캔들 애니메이션 로직을 관리하는 훅
 *
 * 주요 기능:
 * - 창문 상태에 따른 캔들 애니메이션 처리
 * - 두 창문 모두 열림/닫힘/부분 열림 상태별 로직
 * - 캔들 페이드아웃 및 전환 처리
 */
export const useCandleAnimationLogic = (
  playAllCandles,
  stopAllCandles,
  playAllWindowCandles,
  stopAllWindowCandles,
  fadeOutAllWindowCandles
) => {
  /**
   * 두 창문이 모두 열렸을 때의 캔들 애니메이션 처리
   * - 창문 열림 상태 캔들들을 페이드아웃
   * - 일정 시간 후 일반 캔들들 재생 및 창문 캔들들 정지
   */
  const handleBothDoorsOpen = useCallback(
    (
      candleActions,
      time,
      timeoutIdRef,
      playAllCandles,
      stopAllWindowCandles
    ) => {
      // 창문이 모두 열렸을 때의 로직
      const fadeOutCandles = () => {
        candleActions.CandleLightDuringWindowOpenAction?.fadeOut(time / 1000);
        candleActions.CandleLightDuringWindowOpenAction001?.fadeOut(
          time / 1000
        );
        candleActions.CandleLightDuringWindowOpenAction002?.fadeOut(
          time / 1000
        );
        candleActions.CandleLightDuringWindowOpenAction003?.fadeOut(
          time / 1000
        );
        candleActions.ChandelierCandleLightDuringWindowOpenAction?.fadeOut(
          time / 1000
        );

        timeoutIdRef.current = setTimeout(() => {
          playAllCandles(candleActions);
          stopAllWindowCandles(candleActions);
        }, time);
      };

      fadeOutCandles();
    },
    []
  );

  /**
   * 두 창문이 모두 닫혔을 때의 캔들 애니메이션 처리
   * - 클릭 상태에 따라 일반 캔들 또는 창문 캔들 재생
   */
  const handleBothDoorsClosed = useCallback(
    (
      candleActions,
      leftDoorClick,
      rightDoorClick,
      playAllCandles,
      stopAllCandles,
      playAllWindowCandles
    ) => {
      // 창문이 모두 닫혔을 때의 로직
      if (leftDoorClick === 0 && rightDoorClick === 0) {
        playAllCandles(candleActions);
      } else {
        stopAllCandles(candleActions);
        playAllWindowCandles(candleActions);
      }
    },
    []
  );

  /**
   * 창문이 부분적으로 열렸을 때의 캔들 애니메이션 처리
   * - 창문 상태에 따른 복잡한 캔들 전환 로직
   * - 페이드아웃 및 타이머 기반 전환 처리
   */
  const handlePartialDoorState = useCallback(
    (
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
    ) => {
      // 창문이 부분적으로 열렸을 때의 로직
      if (leftDoorClick !== 0 || rightDoorClick !== 0) {
        stopAllCandles(candleActions);
        playAllWindowCandles(candleActions);

        const fadeOutCandles = () => {
          fadeOutAllWindowCandles(candleActions, time);

          timeoutIdRef.current = setTimeout(() => {
            playAllCandles(candleActions);
            stopAllWindowCandles(candleActions);
          }, time);
        };

        if (leftDoorClick === 0 && !WindowLeftDoorActionState) {
          fadeOutCandles();
        }

        if (rightDoorClick === 0 && !WindowRightDoorActionState) {
          fadeOutCandles();
        }
      }
    },
    [
      playAllCandles,
      stopAllCandles,
      playAllWindowCandles,
      stopAllWindowCandles,
      fadeOutAllWindowCandles,
    ]
  );

  return {
    handleBothDoorsOpen,
    handleBothDoorsClosed,
    handlePartialDoorState,
  };
};
