/**
 * 차단된 사용자/기기/IP 설정
 * - 개인정보 보호를 위해 ID나 민감정보는 해시 처리하거나 서버 환경변수로 관리하는 것이 좋지만,
 *   요청에 따라 직접 리스트로 관리합니다.
 */

// 차단할 IP 목록
const BLOCKED_IPS = ["118.235.26.140"];

// 차단할 기기 모델명 (User-Agent에 포함된 문자열)
// 부분 일치로 검사합니다.
const BLOCKED_DEVICE_TYPES = [
  "SM-M536S", // Galaxy M53
];

// 차단할 닉네임 (Google Display Name)
// 정확히 일치하는 경우 차단합니다.
const BLOCKED_NAMES = ["유니", "정동윤"];

// 차단할 구글 ID (Google OAuth ID - 고유값)
// 로그 등을 통해 파악된 악성 유저 ID를 추가합니다.
const BLOCKED_GOOGLE_IDS = [
  // 예: "1234567890..."
];

module.exports = {
  BLOCKED_IPS,
  BLOCKED_DEVICE_TYPES,
  BLOCKED_NAMES,
  BLOCKED_GOOGLE_IDS,
};
