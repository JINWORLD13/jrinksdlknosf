const mongoose = require("mongoose");
const { Schema } = mongoose;

const chargeSchema = new Schema(
  {
    orderId: {
      type: String,
      // [PORTFOLIO] Uniqueness policy simplified for public sharing
      required: true,
    },
    paymentKey: {
      type: String,
      required: false,
      // default: "not yet",
    },
    purchaseToken: {
      // [PORTFOLIO] Alternate payment identifier field
      type: String,
      required: false,
      // default: "",
    },
    orderName: {
      type: String,
      required: true,
    },
    adsFreePass: {
      // [PORTFOLIO] Product entitlement payload abstracted
      type: Object,
      required: false,
    },
    orderHistory: {
      // [PORTFOLIO] Purchased item history shape abstracted
      type: Object,
      required: false,
    },
    orderVouchers: {
      // [PORTFOLIO] Voucher bundle list schema abstracted
      type: Array,
      required: false,
    },
    refundReceiveAccount: {
      // [PORTFOLIO] Refund account payload abstracted
      type: Object,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    productId: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    method: {
      type: String,
      required: false,
    },
    packageName: {
      type: String,
      required: false,
    },
    apiName: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    outOfStock: {
      type: Boolean,
      required: false,
      default: false,
    },
    createdAtForIAP: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chargeSchema.index({ userId: 1, orderId: 1 }, { unique: true });

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 31536000,
    // [PORTFOLIO] Provider-specific retention rules are implementation details.
    partialFilterExpression: { apiName: "Toss" },
    name: "expire_after_1_year_toss",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 7884000,
    partialFilterExpression: { method: "가상계좌" },
    name: "expire_after_3_month_toss",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 7884000,
    partialFilterExpression: { method: "card" },
    name: "expire_after_3_month_paypal_toss",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 2628000,
    partialFilterExpression: { method: "휴대폰" },
    name: "expire_after_1_month_toss",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 259200,
    partialFilterExpression: { productId: "cosmos_vouchers_ads_remover_3d" },
    name: "expire_after_3_day_ads_remover_android",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 259200,
    partialFilterExpression: { productId: "normal_tarot_free_3d" },
    name: "expire_after_3_day_normal_tarot_free_web",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 1200,
    partialFilterExpression: { apiName: "Toss(미입금상태)" },
    name: "expire_after_20_minutes_toss_unpaid",
  }
);

chargeSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 900,
    partialFilterExpression: { paymentKey: "not yet" },
    name: "expire_after_15_minutes_not_yet",
  }
);

// 한국: Charge 모델
// 日本語: Charge モデル
// English: Charge model
const Charge = mongoose.model("Charge", chargeSchema);

module.exports = Charge;
