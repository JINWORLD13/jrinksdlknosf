import { useState } from 'react';

const useIsCSSInvisibleState = inputState => {
  const initialState =
    inputState !== null && inputState !== undefined ? inputState : false;
  const [isCSSInvisible, setIsCSSInvisible] = useState(initialState);

  const updateIsCSSInvisible = newIsCSSInvisible => {
    setIsCSSInvisible(newIsCSSInvisible);
  };

  return [isCSSInvisible, updateIsCSSInvisible];
};

export default useIsCSSInvisibleState;
