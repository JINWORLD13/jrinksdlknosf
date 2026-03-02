const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// 한국: 게스트 타로 스키마 (비로그인 1회)
// 日本語: ゲストタロットスキーマ（未ログイン1回）
// English: Guest tarot schema (one-time, no login)

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

const guestTarotSchema = new Schema(
  {
    // 게스트 경로도 동일한 기준으로 실제 의미 키 대신 추상 구조만 공개한다.
    // ゲスト経路も同じ基準で、実際の意味キーの代わりに抽象構造のみ公開する。
    // The guest path follows the same policy: expose only abstract structure instead of semantic production keys.
    deviceId: { type: String, required: true, index: true },
    // [PORTFOLIO] Question payload schema intentionally abstracted.
    // questionData: { promptText, contextText, optionTexts, ... }
    questionData: { type: Object, required: false },
    // [PORTFOLIO] Reading setup schema intentionally abstracted.
    // readingConfig: { spreadMeta, selectedCards, ... }
    readingConfig: { type: Object, required: true },
    interpretation: { type: String, required: false },
    readingType: { type: String, required: true },
    language: { type: String, required: false },
    hasUsed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

guestTarotSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: SEVEN_DAYS_SECONDS,
    name: "expire_after_7_days_guest_tarot",
  },
);

// 한국: GuestTarot 모델
// 日本語: GuestTarot モデル
// English: GuestTarot model
const GuestTarot = mongoose.model("GuestTarot", guestTarotSchema);
module.exports = GuestTarot;
