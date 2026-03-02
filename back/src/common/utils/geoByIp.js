/**
 * IP → 지역 조회 (지오로케이션). 차단 지역 판별용.
 * - ip-api.com 사용 (무료, 키 불필요). 분당 45회 제한 있으므로 Redis 캐시 사용.
 */

const axios = require("axios");
const cacheClient = require("../../cache/cacheClient");

const CACHE_PREFIX = "cache:geo:ip:";
const CACHE_TTL_SEC = 3600; // 1시간
const API_TIMEOUT_MS = 5000;

/** IP 문자열을 캐시 키에 쓸 수 있게 정리 (IPv6 콜론 등) */
function sanitizeIpForKey(ip) {
  if (typeof ip !== "string") return "";
  return ip.replace(/:/g, "_").trim().slice(0, 50);
}

/**
 * IP로 지역 정보 조회. 실패 시 null, 성공 시 { city, region, country }.
 * @param {string} ip - 클라이언트 IP
 * @returns {Promise<{ city: string, region: string, country: string } | null>}
 */
async function getLocationByIp(ip) {
  if (!ip || typeof ip !== "string" || !ip.trim()) return null;

  const key = CACHE_PREFIX + sanitizeIpForKey(ip);

  try {
    const cached = await cacheClient.get(key);
    if (cached && typeof cached === "object") return cached;
  } catch (_) {
    // Redis 실패 시 API 직접 호출
  }

  try {
    const res = await axios.get(
      `http://ip-api.com/json/${encodeURIComponent(ip.trim())}`,
      {
        timeout: API_TIMEOUT_MS,
        params: { fields: "city,regionName,country" },
      },
    );
    const data = res.data;
    if (!data || data.status === "fail") return null;

    const result = {
      city: (data.city && String(data.city).trim()) || "",
      region: (data.regionName && String(data.regionName).trim()) || "",
      country: (data.country && String(data.country).trim()) || "",
    };

    try {
      await cacheClient.set(key, result, CACHE_TTL_SEC);
    } catch (_) {}

    return result;
  } catch (_) {
    return null;
  }
}

/** 차단 대상 도시명 (소문자/공백 제거 후 비교용) */
const BLOCKED_CITY_NORMALIZED = ["yangyang", "양양", "chuncheon", "춘천"];

/** 특정 기종 차단 대상 도시명 (서울, 양양, 춘천) */
const TARGET_CITY_NORMALIZED = [
  "seoul",
  "서울",
  "yangyang",
  "양양",
  "chuncheon",
  "춘천",
];

/**
 * 해당 IP가 차단 지역(양양, 춘천)이면 true.
 * @param {string} ip - 클라이언트 IP
 * @returns {Promise<boolean>}
 */
async function isBlockedRegion(ip) {
  const loc = await getLocationByIp(ip);
  if (!loc || !loc.city) return false;

  const cityNorm = loc.city.toLowerCase().replace(/\s/g, "");
  return BLOCKED_CITY_NORMALIZED.some((name) =>
    cityNorm.includes(name.toLowerCase().replace(/\s/g, "")),
  );
}

/**
 * 해당 IP가 특정 기종 차단 대상 지역(서울, 양양, 춘천)이면 true.
 * @param {string} ip - 클라이언트 IP
 * @returns {Promise<boolean>}
 */
async function isTargetRegion(ip) {
  const loc = await getLocationByIp(ip);
  if (!loc || !loc.city) return false;

  const cityNorm = loc.city.toLowerCase().replace(/\s/g, "");
  return TARGET_CITY_NORMALIZED.some((name) =>
    cityNorm.includes(name.toLowerCase().replace(/\s/g, "")),
  );
}

module.exports = { getLocationByIp, isBlockedRegion, isTargetRegion };
