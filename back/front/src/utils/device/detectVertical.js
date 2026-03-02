import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

export let detectVertical = () => {
  // 브라우저창의 가로 길이와 세로 길이 가져오기
  let browserWidth = window.innerWidth;
  let browserHeight = window.innerHeight;

  // 사용자 화면(디스플레이)의 가로 길이와 세로 길이 가져오기
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;

  // 브라우저창
  if (browserWidth * 1.32 <= browserHeight) {
    return true;
  }
  // 세로모드
  if (screenWidth * 1.32 < screenHeight) {
    return true;
  }
  return false;
};

export let isNativeAppVertical = () => {
  // 사용자 화면(디스플레이)의 가로 길이와 세로 길이 가져오기
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;

  if (isNative && screenWidth * 1.2 < screenHeight) {
    return true;
  }
  return false;
};
