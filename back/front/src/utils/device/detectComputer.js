import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

export const detectComputer = () => {
  if (isNative) return false;

  // User Agent 기본 체크
  const userAgent = navigator.userAgent.toLowerCase();

  // 1. 명확한 모바일/태블릿 패턴 먼저 확인
  if (
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  ) {
    return false;
  }

  // 2. iPad 별도 처리 (iOS 13+ 에서는 데스크톱 UA 사용)
  if (
    /ipad|tablet/i.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return false;
  }

  // 3. userAgentData가 있을 때만 확인
  if (navigator.userAgentData?.mobile) {
    return false;
  }

  // 4. Windows Phone 체크
  if (/windows phone/i.test(userAgent)) {
    return false;
  }

  // 5. 안드로이드 제외하고 Linux 확인
  if (userAgent.includes('linux') && !userAgent.includes('android')) {
    return true;
  }

  // 6. 기타 데스크톱 OS
  if (/windows|macintosh|mac os x/i.test(userAgent)) {
    return true;
  }

  // 화면 크기 + 터치 지원 여부로 판단
  const screenWidth = window.screen.width;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // iPad나 큰 태블릿 감지
  if (hasTouch && screenWidth < 1024) {
    return false;
  }

  // 터치 지원하는 랩톱 (Surface 등)은 컴퓨터로 간주
  return true;
};
