import { useEffect, useState } from 'react';

const checkAnyModalOpen = modalStateArray => {
  //! some 메서드 : 콜백 함수를 인자로 받습니다. 이 콜백 함수는 배열의 각 요소를 대상으로 실행됩니다. 콜백 함수가 어떤 요소에 대해 true를 반환하면 .some() 메서드는 즉시 true를 반환하고 반복을 중지
  //! 함수 본문: 배열.some(...): 배열의 some 메서드를 사용합니다. 이 메서드는 배열의 요소 중 하나라도 주어진 조건을 만족하면 true를 반환합니다.
  return modalStateArray.some(modalState => modalState);
};

const usePreventModalBackgroundScroll = modalStates => {
  useEffect(() => {
    const isAnyModalOpen = checkAnyModalOpen([modalStates]);

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Reset body's overflow style when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalStates]);
};

export default usePreventModalBackgroundScroll;
