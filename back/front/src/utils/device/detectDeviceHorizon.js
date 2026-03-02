export const detectDeviceHorizon = () => {
  // 사용자 에이전트 문자열 가져오기
  var userAgent = navigator.userAgent.toLowerCase();

  // 스크린의 가로 길이와 세로 길이 가져오기
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  // 터치 기능 여부 확인
  // 'ontouchstart' in window <- 이게 뭔가? onClick 되어도 true임.

  if(screenWidth < screenHeight) return false;

  // 리눅스 컴퓨터(컴퓨터로 간주(안드로이드os는 리눅스 os 기반으로 만들어졌기에...겹치니까))
  if (userAgent.includes('Linux') === true) {
    return false;
  }

  if (
    /mobi|BlackBerry|Windows Phone|Nokia|Android|iphone|ipad|Tablet/i.test(
      userAgent
    ) ||
    navigator.userAgentData.mobile ||
    navigator.userAgentData.platform === 'Android'
  ) {
    return true; // 디바이스로 간주
  }
  return false; // 컴퓨터로 간주(아이패드 에어, 프로는 여기로 들어옴;;)
};
