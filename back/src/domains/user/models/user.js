const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// 한국: 사용자 스키마 (구글 OAuth 기반)
// 日本語: ユーザースキーマ（Google OAuth）
// English: User schema (Google OAuth)

const userSchema = new Schema(
  {
    id: {
      // 한국: 구글 OAuth id
      // 日本語: Google OAuth id
      // English: Google OAuth id
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
      required: false,
    },
    userAgent: {
      // [PORTFOLIO] Device/client metadata (sub-keys intentionally abstracted)
      type: Object,
      required: false,
    },
    ipAdd: {
      type: String,
      required: false,
    },
    adsFreePass: {
      // [PORTFOLIO] Internal product policy field (details redacted)
      type: Object,
      required: false,
    },
    vouchersInDetail: {
      // [PORTFOLIO] Internal voucher metadata (details redacted)
      type: Object,
      required: false,
    },
    vouchers: {
      // [PORTFOLIO] Voucher balance map (key policy abstracted)
      type: Object,
      required: false,
    },
    // Referral fields (optional)
    referredBy: {
      type: String,
      required: false,
      default: null,
    },
    referralRewardClaimed: {
      type: Boolean,
      required: false,
      default: false,
    },
    referralClaimedAt: {
      type: Date,
      required: false,
      default: null,
    },
    referralCount: {
      type: Number,
      required: false,
    },
    // 한국: 포인트
    // 日本語: ポイント
    // English: Points
    stars: {
      type: Number,
      required: false,
    },
    accessToken: {
      // [PORTFOLIO] Token field (actual value stored via runtime only)
      type: String,
      required: false,
    },
    refreshToken: {
      // [PORTFOLIO] Token field (actual value stored via runtime only)
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    isOldUser: {
      // [PORTFOLIO] Internal user lifecycle flag
      type: Boolean,
      required: false,
      default: false,
    },
    purchased: {
      // [PORTFOLIO] Purchase snapshot structure abstracted
      type: Object,
      required: false,
      default: false,
    },
    isRanked: {
      // [PORTFOLIO] Ranking state map abstracted
      type: Object,
      required: false,
    },
    isInViolation: {
      type: Boolean,
      required: false,
      default: false,
    },
    violationsInDetail: {
      // [PORTFOLIO] Violation audit trail format redacted
      type: Array,
      required: false,
      default: [],
    },
    tarotUsageStats: {
      // 한국: 타로 이용 횟수
      // 日本語: タロット利用回数
      // English: Tarot usage count
      type: Object,
      required: false,
    },
    reviewRequestShown: {
      type: Boolean,
      required: false,
      default: false,
    },
    reviewRequestShownAt: {
      type: Date,
      required: false,
      default: null,
    },
    // 한국: 내담자 정보
    // 日本語: クライアント情報
    // English: Counslee info
    counsleeInfo: {
      // [PORTFOLIO] User profile extension fields abstracted
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ ipAdd: 1 });
userSchema.index({
  "userAgent.deviceType": 1,
  "userAgent.os": 1,
  "userAgent.browser": 1,
});
userSchema.index({ referredBy: 1 });

userSchema.index(
  { updatedAt: 1 }, // [PORTFOLIO] TTL cleanup index (policy details redacted)
  {
    expireAfterSeconds: 1900800, // 21일 + 1일
    // [PORTFOLIO] Partial filter is policy-driven and intentionally opaque.
    partialFilterExpression: {
      "adsFreePass.name": "",
      "adsFreePass.expired": "",
      "vouchers.1": 0,
      "vouchers.2": 0,
      "vouchers.3": 0,
      "vouchers.4": 0,
      "vouchers.5": 0,
      "vouchers.6": 0,
      "vouchers.7": 0,
      "vouchers.8": 0,
      "vouchers.9": 0,
      "vouchers.10": 0,
      "vouchers.11": 0,
      "vouchers.13": 0,
    },
    name: "expire_after_3_week(+1_day)_user",
  },
);

// 한국: users 모델
// 日本語: users モデル
// English: User model
const User = mongoose.model("User", userSchema);
module.exports = User;
