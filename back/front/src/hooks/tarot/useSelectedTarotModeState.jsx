import { useState } from 'react';

const useSelectedTarotModeState = inputState => {
  const initialState =
    inputState !== null && inputState !== undefined ? inputState : 2; //! 보통타로로 설정(어른들이 스피드 타로가 먼저 뜨니까 해석이 안나온다고 함. - 사용자 경험)
  const [selectedTarotMode, setSelectedTarotMode] = useState(initialState);

  const updateSelectedTarotMode = newSelectedTarotMode => {
    setSelectedTarotMode(newSelectedTarotMode);
  };

  return [selectedTarotMode, updateSelectedTarotMode];
};

export default useSelectedTarotModeState;
