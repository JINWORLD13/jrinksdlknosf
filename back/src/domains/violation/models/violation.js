const mongoose = require("mongoose");
const { Schema } = mongoose;

const violationSchema = new Schema(
  {
    violationType: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
      index: true, // [PORTFOLIO] Query index retained
    },
    // [PORTFOLIO] Violation detail payload retained with abstracted semantics.
    // refundedAmount/remainingQuantity/violationDescription are internal audit fields.
    refundedAmount: {
      type: String,
      required: false,
    },
    remainingQuantity: {
      type: String,
      required: false,
    },
    violationDate: {
      type: Date,
      required: false,
    },
    violationDescription: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 한국: Violation 모델
// 日本語: Violation モデル
// English: Violation model
const Violation = mongoose.model("Violation", violationSchema);

module.exports = Violation;
