import { useState, useRef } from 'react';

const useBlinkModalState = (inputState) => {
  const initialState = inputState !== null && inputState !== undefined ? inputState : false;
  const [IsBlinkModalOpen, setIsBlinkModalOpen] = useState(initialState);
  const timeoutRef = useRef(null);

  const updateBlinkModalOpen = (newBlinkModal) => {
    // true로 설정할 때 이미 true인 경우, 먼저 false로 설정했다가 다시 true로 설정하여 타임아웃 리셋
    if (newBlinkModal === true) {
      // 이전 타임아웃이 있다면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // 항상 false로 먼저 설정했다가 다음 틱에서 true로 설정하여 타임아웃 리셋
      setIsBlinkModalOpen(false);
      // 다음 틱에서 다시 열어서 타임아웃 리셋
      timeoutRef.current = setTimeout(() => {
        setIsBlinkModalOpen(true);
        timeoutRef.current = null;
      }, 0);
    } else {
      // false로 설정할 때는 이전 타임아웃 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsBlinkModalOpen(newBlinkModal);
    }
  };

  return [IsBlinkModalOpen, updateBlinkModalOpen];
};

export default useBlinkModalState;
