const { sanitizeObject, buildResponse } = require("../../../common/utils/util");
const AppError = require("../../../common/errors/AppError");
const commonErrors = require("../../../common/errors/commonErrors");
const { deletedUserService } = require("../services");
const { tarotService } = require("../../tarot/services");

const deletedUserController = {
  async createUser(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      const deletedUserInfo = await deletedUserService.getUserById(userId);
      if (deletedUserInfo === null || deletedUserInfo === undefined) {
        //! 만들기 전에 삭제된 어카운트 collection에서도 확인후 해보자. 되면, 이벤트 불가(나중에 전번도 추가하는 로직도 넣어보자~)
        const newUser = await deletedUserService.createUser(deletedUserInfo);
        res?.status(200).json(buildResponse(newUser, null, 200));
      } else {
        // 409는 "Conflict"
        next(
          new AppError(
            commonErrors.deletedUserControllerCreaetUserError,
            commonErrors.deletedUserInfoConflictError,
            409
          )
        );
      }
    } catch (err) {
      const customedError = new AppError(err.name, err.message, 401);
      next(customedError);
    }
  },

  // ! 토큰이 발급돼 있는 상태여야 하고 checkToken(decode)가 있어야 함.
  async getUserById(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const userInDB = await deletedUserService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.deletedUserControllerGetUserByIdError,
              commonErrors.deletedUserInfoNotFoundError,
              404
            )
          );
        }
        res?.status(200).json(buildResponse(userInDB, null, 200));
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.deletedUserControllerGetUserByIdError,
            commonErrors.deletedUserUnauthorizedError,
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, 401));
    }
  },

  async putUser(req, res, next) {
    try {
      // ! 토큰이 발급돼 있는 상태여야 함.(관리자에겐 전체 권한)
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const userInDB = await deletedUserService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.deletedUserControllerPutUserError,
              commonErrors.deletedUserInfoNotFoundError,
              404
            )
          );
        }
        const transfferedInfo = req?.body;
        // ? 빈값으로 업데이트 되지 않은 항목 거르기
        const updatedInfoArr = transfferedInfo?.filter(
          (elem) => elem.length > 0
        );
        const updatedUserInfo = { ...userInDB, ...updatedInfoArr };
        const result = await deletedUserService.updateUser(updatedUserInfo);
        res?.status(200).json(buildResponse(result, null, 200));
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.deletedUserControllerPutUserError,
            commonErrors.deletedUserUnauthorizedError,
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, 401));
    }
  },

  // delete 버튼 누르기
  async deleteUser(req, res, next) {
    try {
      // ! 토큰이 발급돼 있는 상태여야 함.(관리자에겐 전체 권한)
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const userInDB = await deletedUserService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.deletedUserControllerDeleteUserError,
              commonErrors.deletedUserInfoNotFoundError,
              404
            )
          );
        }

        res.clearCookie("gAccessTokenCosmos");
        res.clearCookie("gRefreshTokenCosmos");
        res.clearCookie("accessTokenCosmos");
        res.clearCookie("refreshTokenCosmos");
        //! 지우기전에 따로 db에 빼보자.
        //{ acknowledged: true, deletedCount: 1 } 이런식으로 나옴.
        res?.status(204).json(buildResponse({ success: true }, null, 204)); //~ status(204)로 하면 응답값 출력 안됨. 로직은 처리가 됨.
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.deletedUserControllerDeleteUserError,
            commonErrors.deletedUserUnauthorizedError,
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, 401));
    }
  },
};

module.exports = deletedUserController;
