import { useState, useCallback } from 'react';

const useTarotHistory = (initialValue = []) => {
  const [tarotHistory, setTarotHistory] = useState(initialValue);

  const updateTarotHistory = useCallback((newHistory) => {
    setTarotHistory(newHistory);
  }, []);

  // ! js는 함수도 변수로서 사용가능함을 이용.
  return [tarotHistory, updateTarotHistory];
};

export default useTarotHistory;