import { useRef, useCallback, useEffect } from 'react';

/**
 * Web Audio API의 AudioContext와 마스터 게인을 관리하는 훅
 *
 * 주요 기능:
 * - AudioContext 인스턴스 생성 및 관리
 * - 마스터 게인 노드 생성 및 연결
 * - AudioContext 상태 관리 (suspended/resumed)
 * - 메모리 누수 방지를 위한 정리 로직
 */
export const useAudioContext = () => {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);

  /**
   * AudioContext를 초기화하고 마스터 게인 노드를 설정하는 함수
   * - AudioContext가 없으면 새로 생성
   * - 마스터 게인 노드를 생성하고 destination에 연결
   * - suspended 상태인 경우 resume 시도
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      // 마스터 게인 노드 생성 및 연결
      const masterGain = audioContextRef.current.createGain();
      masterGain.connect(audioContextRef.current.destination);
      masterGainRef.current = masterGain;
    }

    // AudioContext가 suspended 상태면 resume 시도
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(e => {
        console.log('AudioContext resume failed:', e);
      });
    }
  }, []);

  /**
   * AudioContext와 관련된 리소스를 정리하는 함수
   * - 컴포넌트 언마운트 시 호출되어 메모리 누수 방지
   */
  const cleanupAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      // 모든 오디오 노드 정리
      if (masterGainRef.current) {
        masterGainRef.current.disconnect();
        masterGainRef.current = null;
      }

      // AudioContext 정리
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => {
          console.log('AudioContext close failed:', e);
        });
      }
      audioContextRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupAudioContext();
    };
  }, [cleanupAudioContext]);

  return {
    audioContextRef,
    masterGainRef,
    initAudioContext,
    cleanupAudioContext,
  };
};
