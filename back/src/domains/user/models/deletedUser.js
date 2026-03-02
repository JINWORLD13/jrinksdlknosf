const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// 한국: 삭제된 사용자 스키마 (복구/이력용)
// 日本語: 削除ユーザースキーマ（復元・履歴用）
// English: Deleted user schema (recovery / audit)

const deletedUserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    deleteReason: {
      type: String,
      required: false,
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
      // [PORTFOLIO] Device/client metadata keys intentionally abstracted.
      type: Object,
      required: false,
      // userAgent: { deviceType, os, browser, login, ... }
      default: {},
    },
    ipAdd: {
      type: String,
      required: false,
      default: "",
    },
    adsFreePass: {
      // [PORTFOLIO] Product entitlement payload abstracted
      type: Object,
      required: false,
    },
    vouchersInDetail: {
      // [PORTFOLIO] Voucher detail map abstracted
      type: Object,
      required: false,
    },
    vouchers: {
      // [PORTFOLIO] Voucher balance map abstracted
      type: Object,
      required: false,
    },
    accessToken: {
      // [PORTFOLIO] Token field retained, usage details redacted
      type: String,
      required: false,
    },
    refreshToken: {
      // [PORTFOLIO] Token field retained, usage details redacted
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: "user",
    },
    isOldUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    isInViolation: {
      type: Boolean,
      required: false,
      default: false,
    },
    violationsInDetail: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

deletedUserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 2628000,
    partialFilterExpression: { role: "user", isOldUser: false },
    name: "expire_after_1_month_deletedUser",
  }
);

deletedUserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 300,
    // [PORTFOLIO] Cleanup condition is policy-driven and intentionally opaque.
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
      isOldUser: false,
    },
    name: "expire_after_5_minutes_deletedUser",
  }
);

// 한국: DeletedUser 모델
// 日本語: DeletedUser モデル
// English: DeletedUser model
const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);
module.exports = DeletedUser;
