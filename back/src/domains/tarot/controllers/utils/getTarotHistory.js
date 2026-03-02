const cacheClient = require("../../../../cache/cacheClient");
const AppError = require("../../../../common/errors/AppError");
const commonErrors = require("../../../../common/errors/commonErrors");
const { userService } = require("../../../user/services");
const { tarotService } = require("../../services");

const getTarotHistory = async (req, res, next) => {
  try {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;
    if (req?.isAuthenticated() === true) {
      const cachedTarotHistory = await cacheClient.get(`cache:tarot:${userId}`);
      if (cachedTarotHistory && cachedTarotHistory?.length > 0) {
        return res.status(200).json([...cachedTarotHistory]);
      }
      const userInfo = await userService.getUserById(userId);
      const userObjId = userInfo?._id;
      const tarotHistoryArr = await tarotService.getHistoryByUserId(userObjId);
      if (!cachedTarotHistory || cachedTarotHistory?.length === 0) {
        await cacheClient.set(`cache:tarot:${userId}`, tarotHistoryArr, 3600); // 1시간 캐싱
      }
      res.status(200).json([...tarotHistoryArr]);
    } else {
      next(
        new AppError(
          commonErrors.tarotControllerGetHistoryError,
          commonErrors.userNotFoundError,
          404
        )
      );
    }
  } catch (err) {
    next(new AppError(err.name, err.message, err.statusCode));
  }
};

module.exports = getTarotHistory;
