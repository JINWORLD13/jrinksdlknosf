const { isBlockedRegion, isTargetRegion } = require("./geoByIp");
const {
  BLOCKED_IPS,
  BLOCKED_DEVICE_TYPES,
  BLOCKED_NAMES,
  BLOCKED_GOOGLE_IDS,
} = require("./blockedUsers");
const { parseUserAgent } = require("./parseUserAgent");

/**
 * 접속 차단 여부를 확인하는 서비스
 * @param {string} ip - 클라이언트 IP
 * @param {string} uaString - User-Agent 문자열
 * @param {object} userProfile - 사용자 프로필 (id, displayName 등) - 로그인 시 또는 토큰 디코딩 후
 * @returns {Promise<{ blocked: boolean, reason: string | null }>}
 */
async function checkBlocking({ ip, uaString, userProfile = null }) {
  // 1. 지역 차단 (양양·춘천만 - 서울 제외)
  if (ip && (await isBlockedRegion(ip))) {
    return { blocked: true, reason: "BLOCKED_REGION" };
  }

  // 2. IP 차단 (특정 IP)
  if (ip && BLOCKED_IPS.some((blockedIp) => ip.includes(blockedIp))) {
    return { blocked: true, reason: "BLOCKED_IP" };
  }

  // 3. 기기 + 지역 조합 차단 (SM-M536S && (서울 || 양양 || 춘천))
  const ua = parseUserAgent(uaString);
  const deviceString = ua.deviceType || "";
  const rawUA = ua.rawUA || "";

  const isBlockedDevice = BLOCKED_DEVICE_TYPES.some(
    (device) => rawUA.includes(device) || deviceString.includes(device),
  );

  if (isBlockedDevice && ip && (await isTargetRegion(ip))) {
    return { blocked: true, reason: "BLOCKED_DEVICE_REGION" };
  }

  // 4. 사용자 정보 차단 (ID, 닉네임)
  if (userProfile) {
    // ID 차단
    if (userProfile.id && BLOCKED_GOOGLE_IDS.includes(userProfile.id)) {
      return { blocked: true, reason: "BLOCKED_ID" };
    }
    // 닉네임 차단
    if (
      userProfile.displayName &&
      BLOCKED_NAMES.includes(userProfile.displayName)
    ) {
      return { blocked: true, reason: "BLOCKED_NAME" };
    }
  }

  return { blocked: false, reason: null };
}

module.exports = { checkBlocking };
