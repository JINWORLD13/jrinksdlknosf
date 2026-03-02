/**
 * User-Agent 파싱 (기기/OS/브라우저).
 * - 사람 구분은 Google OAuth id로 함. userAgent/ip는 세션·통계·이상 접근 확인용.
 * - UA 문자열이 축소된 브라우저(Chrome UA reduction 등)에서는 기기명이 "Generic"으로 나올 수 있음.
 */

const UAParser = require("ua-parser-js");

const UNKNOWN = "Unknown";

/**
 * @param {string} [uaString] - Request의 User-Agent 헤더
 * @returns {{ deviceType: string, os: string, browser: string, rawUA: string }}
 */
function parseUserAgent(uaString) {
  const rawUA = typeof uaString === "string" ? uaString.trim() : "";
  if (!rawUA) {
    return {
      deviceType: UNKNOWN,
      os: UNKNOWN,
      browser: UNKNOWN,
      rawUA: "",
    };
  }

  const parser = new UAParser(rawUA);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  const has = (v) => v != null && String(v).trim() !== "";

  // deviceType: 모델명이 있으면 사용, 없으면 타입(mobile/tablet) + 제조사로 표시
  let deviceType = UNKNOWN;
  if (has(device.model)) {
    deviceType = [device.vendor, device.model].filter(Boolean).join(" ").trim() || device.model;
  } else if (has(device.type)) {
    const vendor = has(device.vendor) ? device.vendor : "";
    deviceType = vendor ? `${vendor} ${device.type}`.trim() : device.type;
  }

  const osName = has(os.name) ? os.name : UNKNOWN;
  const osVersion = has(os.version) ? os.version : "";
  const osStr = osVersion ? `${osName} ${osVersion}`.trim() : osName;

  const browserName = has(browser.name) ? browser.name : UNKNOWN;
  const browserVersion = has(browser.version) ? browser.version : "";
  const browserStr = browserVersion ? `${browserName} ${browserVersion}`.trim() : browserName;

  return {
    deviceType: deviceType.trim() || UNKNOWN,
    os: osStr.trim() || UNKNOWN,
    browser: browserStr.trim() || UNKNOWN,
    rawUA: rawUA.slice(0, 512), // DB 크기 제한용
  };
}

module.exports = { parseUserAgent, UNKNOWN };
