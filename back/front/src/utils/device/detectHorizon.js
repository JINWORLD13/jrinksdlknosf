import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

export let detectHorizon = () => {
  // 브라우저창의 가로 길이와 세로 길이 가져오기
  let browserWidth = window.innerWidth;
  let browserHeight = window.innerHeight;

  // 사용자 화면(디스플레이)의 가로 길이와 세로 길이 가져오기
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;

  // 브라우저창
  if (browserWidth > browserHeight * 1.32) {
    return true;
  }
  // 가로모드 (height에 얼마를 더해야 말풍선이 보이는지 테스트하기 - 125px)
  if (screenWidth >= screenHeight * 1.32) {
    return true;
  }
  return false;
};

export let isNativeAppHorizontal = () => {
  // 사용자 화면(디스플레이)의 가로 길이와 세로 길이 가져오기
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;

  // 기기 가로모드
  if (isNative && screenWidth > screenHeight * 1.2) {
    return true;
  }
  return false;
};
