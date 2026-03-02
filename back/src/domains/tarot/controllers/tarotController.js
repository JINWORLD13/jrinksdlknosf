const postQuestionToAI = require("./utils/postQuestionToAI");
const getTarotHistory = require("./utils/getTarotHistory");
const deleteTarotHistory = require("./utils/deleteTarotHistory");
const getJobStatus = require("./utils/getJobStatus");

const tarotController = {
  async postQuestionForNormalToAI(req, res, next) {
    await postQuestionToAI(req, res, next, 2);
  },

  async postQuestionForDeepToAI(req, res, next) {
    await postQuestionToAI(req, res, next, 3);
  },

  async postQuestionForSeriousToAI(req, res, next) {
    await postQuestionToAI(req, res, next, 4);
  },

  async getHistory(req, res, next) {
    await getTarotHistory(req, res, next);
  },

  async deleteHistory(req, res, next) {
    await deleteTarotHistory(req, res, next);
  },

  async getJobStatus(req, res, next) {
    await getJobStatus(req, res, next);
  },
};

module.exports = tarotController;
