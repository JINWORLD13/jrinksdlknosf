/**
 * 브라우저 언어 파싱 유틸리티
 * Accept-Language 헤더에서 지원하는 언어를 추출
 */
const parseLanguage = (req) => {
  const acceptLanguage = req.headers["accept-language"] || "en";
  const supportedLanguages = ["ko", "en", "ja"];

  const browserLanguage =
    acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0])
      .find((lang) => supportedLanguages.includes(lang)) || "en";

  return browserLanguage;
};

module.exports = {
  parseLanguage,
};
