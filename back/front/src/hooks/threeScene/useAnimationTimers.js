import { useRef, useCallback, useEffect } from 'react';

/**
 * 애니메이션 타이머들을 관리하는 훅
 *
 * 주요 기능:
 * - setTimeout과 setInterval 타이머 관리
 * - 메모리 누수 방지를 위한 타이머 정리
 * - 여러 종류의 타이머를 독립적으로 관리
 */
export const useAnimationTimers = () => {
  const timerRef = useRef(null);
  const timerOfMagicRef = useRef(null);
  const intervalRef = useRef(null);

  /**
   * 모든 타이머를 정리하는 함수
   * - 메모리 누수 방지를 위해 컴포넌트 언마운트 시 호출
   */
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (timerOfMagicRef.current) {
      clearTimeout(timerOfMagicRef.current);
      timerOfMagicRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * 일반 타이머를 설정하는 함수
   * @param {Function} callback - 실행할 콜백 함수
   * @param {number} delay - 지연 시간 (ms)
   */
  const setTimer = useCallback((callback, delay) => {
    clearTimer();
    timerRef.current = setTimeout(callback, delay);
  }, []);

  /**
   * 매직 타이머를 설정하는 함수
   * @param {Function} callback - 실행할 콜백 함수
   * @param {number} delay - 지연 시간 (ms)
   */
  const setMagicTimer = useCallback((callback, delay) => {
    clearMagicTimer();
    timerOfMagicRef.current = setTimeout(callback, delay);
  }, []);

  /**
   * 인터벌 타이머를 설정하는 함수
   * @param {Function} callback - 실행할 콜백 함수
   * @param {number} delay - 반복 간격 (ms)
   */
  const setIntervalTimer = useCallback((callback, delay) => {
    clearIntervalTimer();
    intervalRef.current = setInterval(callback, delay);
  }, []);

  /**
   * 일반 타이머를 정리하는 함수
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * 매직 타이머를 정리하는 함수
   */
  const clearMagicTimer = useCallback(() => {
    if (timerOfMagicRef.current) {
      clearTimeout(timerOfMagicRef.current);
      timerOfMagicRef.current = null;
    }
  }, []);

  /**
   * 인터벌 타이머를 정리하는 함수
   */
  const clearIntervalTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    timerRef,
    timerOfMagicRef,
    intervalRef,
    setTimer,
    setMagicTimer,
    setIntervalTimer,
    clearTimer,
    clearMagicTimer,
    clearIntervalTimer,
    clearAllTimers,
  };
};
