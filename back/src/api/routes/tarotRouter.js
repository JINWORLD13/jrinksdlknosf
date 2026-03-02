const { tarotController } = require("../../domains/tarot/controllers/index");
const checkTokenWithRefresh = require("../middlewares/checkTokenWithRefresh");
const tarotRouter = require("express").Router();

//~ Claude & OpenAI
tarotRouter.post(
  "/readings/normal",
  checkTokenWithRefresh,
  tarotController.postQuestionForNormalToAI,
);

tarotRouter.post(
  "/readings/deep",
  checkTokenWithRefresh,
  tarotController.postQuestionForDeepToAI,
);

tarotRouter.post(
  "/readings/serious",
  checkTokenWithRefresh,
  tarotController.postQuestionForSeriousToAI,
);

tarotRouter.get(
  "/readings",
  checkTokenWithRefresh,
  tarotController.getHistory,
);
tarotRouter.delete(
  "/readings",
  checkTokenWithRefresh,
  tarotController.deleteHistory,
);

tarotRouter.get(
  "/status/:jobId",
  tarotController.getJobStatus,
);

module.exports = tarotRouter;
