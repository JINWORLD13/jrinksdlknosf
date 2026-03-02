import { useCallback } from 'react';

/**
 * 캔들 상태 관리를 담당하는 훅
 *
 * 주요 기능:
 * - 캔들 액션들의 상태 관리
 * - 캔들 재생/정지/페이드아웃 제어
 * - 창문 상태에 따른 캔들 동작 처리
 */
export const useCandleStateManager = () => {
  /**
   * 캔들 액션들을 추출하는 함수
   * @param {Object} actions - 전체 액션 객체
   * @returns {Object} 캔들 관련 액션들만 필터링된 객체
   */
  const getCandleActions = useCallback(actions => {
    return {
      CandleLightAction: actions.CandleLightAction,
      CandleLightAction001: actions.CandleLightAction001,
      CandleLightAction002: actions.CandleLightAction002,
      CandleLightAction003: actions.CandleLightAction003,
      CandleLightDuringWindowOpenAction:
        actions.CandleLightDuringWindowOpenAction,
      CandleLightDuringWindowOpenAction001:
        actions.CandleLightDuringWindowOpenAction001,
      CandleLightDuringWindowOpenAction002:
        actions.CandleLightDuringWindowOpenAction002,
      CandleLightDuringWindowOpenAction003:
        actions.CandleLightDuringWindowOpenAction003,
      ChandelierCandleLightAction: actions.ChandelierCandleLightAction,
      ChandelierCandleLightDuringWindowOpenAction:
        actions.ChandelierCandleLightDuringWindowOpenAction,
    };
  }, []);

  /**
   * 모든 일반 캔들을 재생하는 함수
   * @param {Object} candleActions - 캔들 액션 객체들
   */
  const playAllCandles = useCallback(candleActions => {
    candleActions.CandleLightAction?.play();
    candleActions.CandleLightAction001?.play();
    candleActions.CandleLightAction002?.play();
    candleActions.CandleLightAction003?.play();
    candleActions.ChandelierCandleLightAction?.play();
  }, []);

  /**
   * 모든 일반 캔들을 정지하는 함수
   * @param {Object} candleActions - 캔들 액션 객체들
   */
  const stopAllCandles = useCallback(candleActions => {
    candleActions.CandleLightAction?.stop();
    candleActions.CandleLightAction001?.stop();
    candleActions.CandleLightAction002?.stop();
    candleActions.CandleLightAction003?.stop();
    candleActions.ChandelierCandleLightAction?.stop();
  }, []);

  /**
   * 모든 창문 열림 상태 캔들을 재생하는 함수
   * @param {Object} candleActions - 캔들 액션 객체들
   */
  const playAllWindowCandles = useCallback(candleActions => {
    candleActions.CandleLightDuringWindowOpenAction?.play();
    candleActions.CandleLightDuringWindowOpenAction001?.play();
    candleActions.CandleLightDuringWindowOpenAction002?.play();
    candleActions.CandleLightDuringWindowOpenAction003?.play();
    candleActions.ChandelierCandleLightDuringWindowOpenAction?.play();
  }, []);

  /**
   * 모든 창문 열림 상태 캔들을 정지하는 함수
   * @param {Object} candleActions - 캔들 액션 객체들
   */
  const stopAllWindowCandles = useCallback(candleActions => {
    candleActions.CandleLightDuringWindowOpenAction?.stop();
    candleActions.CandleLightDuringWindowOpenAction001?.stop();
    candleActions.CandleLightDuringWindowOpenAction002?.stop();
    candleActions.CandleLightDuringWindowOpenAction003?.stop();
    candleActions.ChandelierCandleLightDuringWindowOpenAction?.stop();
  }, []);

  /**
   * 모든 창문 열림 상태 캔들을 페이드아웃하는 함수
   * @param {Object} candleActions - 캔들 액션 객체들
   * @param {number} time - 페이드아웃 시간 (ms)
   */
  const fadeOutAllWindowCandles = useCallback((candleActions, time) => {
    candleActions.CandleLightDuringWindowOpenAction?.fadeOut(time / 1000);
    candleActions.CandleLightDuringWindowOpenAction001?.fadeOut(time / 1000);
    candleActions.CandleLightDuringWindowOpenAction002?.fadeOut(time / 1000);
    candleActions.CandleLightDuringWindowOpenAction003?.fadeOut(time / 1000);
    candleActions.ChandelierCandleLightDuringWindowOpenAction?.fadeOut(
      time / 1000
    );
  }, []);

  return {
    getCandleActions,
    playAllCandles,
    stopAllCandles,
    playAllWindowCandles,
    stopAllWindowCandles,
    fadeOutAllWindowCandles,
  };
};
