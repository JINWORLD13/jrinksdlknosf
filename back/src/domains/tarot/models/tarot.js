const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const THREE_MONTHS_SECONDS = 60 * 60 * 24 * 90;

const tarotSchema = new Schema(
  {
    // 포트폴리오 공개에서는 실제 운영 키를 그대로 노출하지 않고 구조만 보이도록 추상화했다.
    // ポートフォリオ公開では実運用キーをそのまま露出せず、構造だけ見えるように抽象化した。
    // For portfolio exposure, real production keys are abstracted so only structural intent remains visible.
    // [PORTFOLIO] Question payload schema intentionally abstracted.
    // questionData: { promptText, contextText, optionTexts, ... }
    questionData: { type: Object, required: false },
    // [PORTFOLIO] Reading setup schema intentionally abstracted.
    // readingConfig: { spreadMeta, selectedCards, ... }
    readingConfig: { type: Object, required: true },
    // [PORTFOLIO] Combined reading configuration kept abstract.
    // combinedReadingConfig: { selectedCards, mergePolicy, ... }
    combinedReadingConfig: { type: Object, required: false },
    interpretation: { type: String, required: false },
    readingType: { type: String, required: true },
    language: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    timeOfCounselling: { type: String, required: false },
    additionalQuestionCount: { type: Number, required: false, default: 0 },
    hasAdditionalQuestion: { type: Boolean, required: false, default: false },
    originalTarotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarot",
      required: false,
    },
    // [PORTFOLIO] Parent relation field (branching detail redacted)
    parentTarotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarot",
      required: false,
    },
    // [PORTFOLIO] Chain relation field (composition detail redacted)
    tarotIdChain: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tarot",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tarotSchema.index(
  { "questionData.question": 1, timeOfCounselling: 1 },
  { unique: true },
);

tarotSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: THREE_MONTHS_SECONDS,
    name: "expire_after_3_month_tarot",
  },
);

// 한국: Tarot 모델
// 日本語: Tarot モデル
// English: Tarot model
const Tarot = mongoose.model("Tarot", tarotSchema);
module.exports = Tarot;
