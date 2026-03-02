const cacheClient = require("../../../../cache/cacheClient");
const AppError = require("../../../../common/errors/AppError");
const commonErrors = require("../../../../common/errors/commonErrors");
const { buildResponse } = require("../../../../common/utils/util");
const { tarotService } = require("../../services");

const deleteTarotHistory = async (req, res, next) => {
  try {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;
    if (req?.isAuthenticated() === true) {
      await cacheClient.del(`cache:tarot:${userId}`);
      const tarotHistoryData = req?.body?.tarotHistoryData ?? null;
      const isDeleteAll = req?.body?.isDeleteAll ?? false;
      const language = req?.body?.language ?? null;

      //! 전체 삭제: userId + language 기반으로 MongoDB deleteMany 직접 실행
      if (isDeleteAll && language) {
        // userInfo에서 userObjId 가져오기
        const { userService } = require("../../../user/services");
        const userInfo = await userService.getUserById(userId);

        if (!userInfo || !userInfo._id) {
          next(
            new AppError(
              commonErrors.tarotControllerDeleteHistoryError,
              commonErrors.userNotFoundError,
              404
            )
          );
          return;
        }

        const result = await tarotService.deleteTarotsByUserObjIdAndLanguage(
          userInfo._id,
          language
        );
        res.status(204).json(buildResponse(null, null, 204));
        return;
      }

      //& 개별 삭제 또는 일부 삭제: tarotHistoryData가 array인지 아닌지
      if (Array.isArray(tarotHistoryData)) {
        // createdAt 배열로 삭제 - 유니크하고 신뢰성 높음
        const createdAtArr = tarotHistoryData?.map((oneTarotHistoryData, i) => {
          return oneTarotHistoryData?.createdAt;
        });
        const tarotHistory = await tarotService.deleteTarotsByCreatedAtArr(
          createdAtArr
        );
        res.status(204).json(buildResponse(null, null, 204));
        return;
      }

      if (tarotHistoryData && !Array.isArray(tarotHistoryData)) {
        // createdAt으로 삭제 - 유니크하고 신뢰성 높음
        let createdAt = tarotHistoryData?.createdAt;
        const tarotHistory = await tarotService.deleteTarotByCreatedAt(
          createdAt
        );
        res.status(204).json(buildResponse(null, null, 204));
        return;
      }

      // tarotHistoryData가 null이거나 유효하지 않은 경우
      next(
        new AppError(
          commonErrors.tarotControllerDeleteHistoryError,
          commonErrors.userNotFoundError,
          400
        )
      );
    } else {
      next(
        new AppError(
          commonErrors.tarotControllerDeleteHistoryError,
          commonErrors.userNotFoundError,
          404
        )
      );
    }
  } catch (err) {
    next(new AppError(err.name, err.message, err.statusCode));
  }
};

module.exports = deleteTarotHistory;
