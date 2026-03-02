// 읽기 타입 라벨 — ENV에서 로드, 저장·응답에는 short만 사용 (normal / deep / serious)
// リーディングタイプラベル — ENVから読み込み、保存・応答にはshortのみ使用
// Reading type label — Load from ENV, use short form only for storage/response

const DEFAULTS = {
  2: "normal",
  3: "deep",
  4: "serious",
};

function getReadingType(modelNumber) {
  return (
    process.env[`COSMOS_TAROT_READING_TYPE_${modelNumber}`] ||
    DEFAULTS[modelNumber] ||
    "normal"
  );
}

function getGuestReadingType() {
  return process.env.COSMOS_TAROT_READING_TYPE_GUEST || "normal";
}

module.exports = {
  getReadingType,
  getGuestReadingType,
};
