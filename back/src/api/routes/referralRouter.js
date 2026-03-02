const referralRouter = require("express").Router();
const checkTokenWithRefresh = require("../middlewares/checkTokenWithRefresh");
const referralController = require("../../domains/referral/controllers/referralController");

// Claim referral reward (invitee side)
referralRouter.post(
  "/claim",
  checkTokenWithRefresh,
  referralController.claimReferral
);

module.exports = referralRouter;























