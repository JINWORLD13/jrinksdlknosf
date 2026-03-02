import { useState, useEffect } from 'react';

const useWindowSizeState = () => {
  // 초기 설정 및 변수선언
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // 기능 설정 (크기 변경 함수)
  const handleResize = () => {
    //! window.innerWidth는 브라우저창 크기임.(가변) / window.screen.width은 기기 모니터 크기임.(고정)
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  // 실시간 구동 -> 이벤트에 반응하도록 -> useEffect와 addEventListenr
  useEffect(() => {
    // Component mount: add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Component unmount: remove event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 실시간 값 반영
  return { windowWidth, windowHeight };
};

export default useWindowSizeState;
