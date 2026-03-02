import { useState } from 'react';

const useIsCSSInvisibleState = inputState => {
  const initialState =
    inputState !== null && inputState !== undefined ? inputState : false;
  const [isCSSInvisible, setIsCSSInvisibleInternal] = useState(initialState);

  const setIsCSSInvisible = newCSSInvisible => {
    setIsCSSInvisibleInternal(newCSSInvisible);
  };

  return [isCSSInvisible, setIsCSSInvisible];
};

export default useIsCSSInvisibleState;
