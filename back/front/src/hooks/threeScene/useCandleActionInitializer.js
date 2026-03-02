import { useRef, useCallback, useEffect } from 'react';

/**
 * 캔들 액션 초기화를 관리하는 훅
 */
export const useCandleActionInitializer = (initializedActions, isWaiting) => {
  const actionsRef = useRef(initializedActions);
  const timeoutIdRef = useRef();

  // 애니메이션 액션 초기화 함수
  const initializeActions = useCallback(() => {
    actionsRef.current = {
      ...actionsRef.current,
      CandleLightAction: actionsRef.current.CandleLightAction || {
        play: () => {},
        stop: () => {},
      },
      CandleLightAction001: actionsRef.current.CandleLightAction001 || {
        play: () => {},
        stop: () => {},
      },
      CandleLightAction002: actionsRef.current.CandleLightAction002 || {
        play: () => {},
        stop: () => {},
      },
      CandleLightAction003: actionsRef.current.CandleLightAction003 || {
        play: () => {},
        stop: () => {},
      },
      CandleLightDuringWindowOpenAction: actionsRef.current
        .CandleLightDuringWindowOpenAction || {
        play: () => {},
        stop: () => {},
        fadeOut: () => {},
      },
      CandleLightDuringWindowOpenAction001: actionsRef.current
        .CandleLightDuringWindowOpenAction001 || {
        play: () => {},
        stop: () => {},
        fadeOut: () => {},
      },
      CandleLightDuringWindowOpenAction002: actionsRef.current
        .CandleLightDuringWindowOpenAction002 || {
        play: () => {},
        stop: () => {},
        fadeOut: () => {},
      },
      CandleLightDuringWindowOpenAction003: actionsRef.current
        .CandleLightDuringWindowOpenAction003 || {
        play: () => {},
        stop: () => {},
        fadeOut: () => {},
      },
      ChandelierCandleLightAction: actionsRef.current
        .ChandelierCandleLightAction || {
        play: () => {},
        stop: () => {},
      },
      ChandelierCandleLightDuringWindowOpenAction: actionsRef.current
        .ChandelierCandleLightDuringWindowOpenAction || {
        play: () => {},
        stop: () => {},
        fadeOut: () => {},
      },
    };
  }, []);

  // 컴포넌트 마운트 시 액션 초기화
  useEffect(() => {
    initializeActions();
  }, [initializeActions]);

  // cleanup 함수를 별도로 관리
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

  return {
    actionsRef,
    timeoutIdRef,
  };
};
