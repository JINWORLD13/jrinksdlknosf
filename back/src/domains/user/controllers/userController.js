const { sanitizeObject, buildResponse } = require("../../../common/utils/util");
const AppError = require("../../../common/errors/AppError");
const commonErrors = require("../../../common/errors/commonErrors");
const { userService, deletedUserService } = require("../services");
const { tarotService } = require("../../tarot/services");
const { chargeService } = require("../../charge/services");
const cacheClient = require("../../../cache/cacheClient");

const userController = {
  //& createUser는 사용하지 않음(googlePassportForJWT에서 생성함)
  //& 자체 로그인(rea.body)이나 다른 방식으로 userInfo 전달 받을 수 있다면 수정 필요함.
  async createUser(req, res, next) {
    try {
      // 구글 OAUTH 고유 ID로 식별
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      const userInfo = await userService.getUserById(userId);
      if (!userInfo) {
        //! 만들기 전에 삭제된 어카운트 collection에서도 확인후 해보자. 되면, 이벤트 불가(나중에 전번도 추가하는 로직도 넣어보자~)
        const transmittedUserInfo = req?.body.userInfo;
        if (!transmittedUserInfo) {
          return next(
            new AppError(
              "UserInfoMissing",
              "User info is required to create a new user",
              400
            )
          );
        }
        const newUser = await userService.createUser(transmittedUserInfo);
        res?.status(200).json(buildResponse(newUser, null, 200));
      } else {
        // 409는 "Conflict"
        next(
          new AppError(
            commonErrors.userControllerCreaetUserError,
            commonErrors.userConflictError,
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
        const userFromCache = await cacheClient.get(`user:${userId}`);
        if (userFromCache) {
          // 캐시된 사용자 정보도 날짜 변환 처리
          const processedCachedUser = { ...userFromCache };
          if (processedCachedUser?.vouchersInDetail && typeof processedCachedUser.vouchersInDetail === 'object') {
            const vouchersInDetail = { ...processedCachedUser.vouchersInDetail };
            
            // 모든 이용권 타입에 대해 처리
            await Promise.all(
              Object.keys(vouchersInDetail).map(async (key) => {
                const vouchers = vouchersInDetail[key];
                if (Array.isArray(vouchers)) {
                  // 각 이용권에 대해 날짜 변환
                  for (let i = 0; i < vouchers.length; i++) {
                    const voucher = vouchers[i];
                    if (Array.isArray(voucher) && voucher.length > 5) {
                      // 인덱스 5가 'date' 문자열이면 실제 날짜로 변환
                      if (voucher[5] === 'date' || voucher[5] === 'Date' || !voucher[5] || voucher[5] === '') {
                        const orderId = voucher[4];
                        if (orderId) {
                          try {
                            // orderId로 Charge를 조회하여 실제 구매일 가져오기
                            const chargeInfo = await chargeService.getChargeByOrderId(orderId);
                            if (chargeInfo && chargeInfo.createdAt) {
                              // Charge의 createdAt을 ISO 문자열로 변환
                              voucher[5] = new Date(chargeInfo.createdAt).toISOString();
                            } else {
                              // Charge가 없으면 현재 날짜 사용
                              voucher[5] = new Date().toISOString();
                            }
                          } catch (error) {
                            // 에러 발생 시 현재 날짜 사용
                            voucher[5] = new Date().toISOString();
                          }
                        } else {
                          // orderId가 없으면 현재 날짜 사용
                          voucher[5] = new Date().toISOString();
                        }
                      }
                    }
                  }
                }
              })
            );
            
            processedCachedUser.vouchersInDetail = vouchersInDetail;
          }
          return res.status(200).json(buildResponse(processedCachedUser, null, 200));
        }
        let finalUserInfo;
        const userInDB = await userService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.userControllerGetUserByIdError,
              commonErrors.userNotFoundError,
              404
            )
          );
        }
        finalUserInfo = userInDB;
        
        // vouchersInDetail의 'date' 문자열을 실제 날짜로 변환
        if (finalUserInfo?.vouchersInDetail && typeof finalUserInfo.vouchersInDetail === 'object') {
          const vouchersInDetail = { ...finalUserInfo.vouchersInDetail };
          
          // 모든 이용권 타입에 대해 처리
          await Promise.all(
            Object.keys(vouchersInDetail).map(async (key) => {
              const vouchers = vouchersInDetail[key];
              if (Array.isArray(vouchers)) {
                // 각 이용권에 대해 날짜 변환
                for (let i = 0; i < vouchers.length; i++) {
                  const voucher = vouchers[i];
                  if (Array.isArray(voucher) && voucher.length > 5) {
                    // 인덱스 5가 'date' 문자열이면 실제 날짜로 변환
                    if (voucher[5] === 'date' || voucher[5] === 'Date' || !voucher[5] || voucher[5] === '') {
                      const orderId = voucher[4];
                      if (orderId) {
                        try {
                          // orderId로 Charge를 조회하여 실제 구매일 가져오기
                          const chargeInfo = await chargeService.getChargeByOrderId(orderId);
                          if (chargeInfo && chargeInfo.createdAt) {
                            // Charge의 createdAt을 ISO 문자열로 변환
                            voucher[5] = new Date(chargeInfo.createdAt).toISOString();
                          } else {
                            // Charge가 없으면 현재 날짜 사용
                            voucher[5] = new Date().toISOString();
                          }
                        } catch (error) {
                          // 에러 발생 시 현재 날짜 사용
                          voucher[5] = new Date().toISOString();
                        }
                      } else {
                        // orderId가 없으면 현재 날짜 사용
                        voucher[5] = new Date().toISOString();
                      }
                    }
                  }
                }
              }
            })
          );
          
          finalUserInfo.vouchersInDetail = vouchersInDetail;
        }
        
        // 광고 패스 검증 간단히
        const hasValidAdsFreePass = (pass) => {
          return pass?.name && pass?.orderId && pass?.expired;
        };
        if (hasValidAdsFreePass(userInDB?.adsFreePass)) {
          //! TTL로 n일 뒤 자동으로 사라지게 함.
          //! productId로 설정했으니 변경시 변경해야 함.
          const chargeInfo = await chargeService.getChargeByOrderId(
            userInDB?.adsFreePass?.orderId
          );
          
          // 만료일 체크
          const expiredDate = new Date(userInDB?.adsFreePass?.expired);
          const currentDate = new Date();
          const isExpired = isNaN(expiredDate.getTime()) || expiredDate <= currentDate;
          
          // charge 문서가 없거나 만료일이 지났으면 adsFreePass 초기화
          if (!chargeInfo || !chargeInfo?.orderId || isExpired) {
            finalUserInfo = await userService.updateUser({
              ...userInDB,
              adsFreePass: { name: "", orderId: "", expired: "" },
            });
          }
        }
        await cacheClient.set(`user:${userId}`, finalUserInfo, 3600); // 1시간 캐싱
        res?.status(200).json(buildResponse(finalUserInfo, null, 200));
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.userControllerGetUserByIdError,
            commonErrors.userUnauthorizedError,
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
        const userInDB = await userService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.userControllerPutUserError,
              commonErrors.userNotFoundError,
              404
            )
          );
        }
        const transferredInfo = req?.body || {};
        const userPlain =
          typeof userInDB.toObject === "function"
            ? userInDB.toObject()
            : userInDB;
        // 계정별·언어별 내담자 정보: 언어 키별로 병합 (기존 counsleeInfo에 덮어쓰기)
        if (
          transferredInfo.counsleeInfo != null &&
          typeof transferredInfo.counsleeInfo === "object" &&
          !Array.isArray(transferredInfo.counsleeInfo)
        ) {
          const existing = userPlain.counsleeInfo && typeof userPlain.counsleeInfo === "object"
            ? userPlain.counsleeInfo
            : {};
          transferredInfo.counsleeInfo = { ...existing, ...transferredInfo.counsleeInfo };
        }
        const updatedUserInfo = { ...userPlain, ...transferredInfo };
        const result = await userService.updateUser(updatedUserInfo);
        res?.status(200).json(buildResponse(result, null, 200));
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.userControllerPutUserError,
            commonErrors.userUnauthorizedError,
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
        await cacheClient.del(`user:${userId}`);
        await cacheClient.del(`cache:tarot:${userId}`);
        const userInDB = await userService.getUserById(userId);
        if (userInDB === undefined || userInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.userControllerDeleteUserError,
              commonErrors.userNotFoundError,
              404
            )
          );
          return;
        }

        //! 지우기전에 따로 db에 빼보자.
        //{ acknowledged: true, deletedCount: 1 } 이런식으로 나옴.
        const result = await tarotService.deleteTarotsByUserObjId(userInDB._id);
        const resultOfDeleteCharge =
          await chargeService.deleteChargesByUserObjId(userInDB._id);

        const deletedUser = await userService.deleteUser(userInDB);
        const updatedDeletedUser = {
          ...deletedUser?._doc,
        };
        const resultOfDeletedUser = await deletedUserService.createUser(
          updatedDeletedUser
        );
        res.clearCookie("gAccessTokenCosmos");
        res.clearCookie("gRefreshTokenCosmos");
        res.clearCookie("accessTokenCosmos");
        res.clearCookie("refreshTokenCosmos");
        res?.status(204).json(buildResponse({ success: true }, null, 204)); //~ status(204)로 하면 응답값 출력 안됨. 로직은 처리가 됨.
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.userControllerDeleteUserError,
            commonErrors.userUnauthorizedError,
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, 401));
    }
  },
};

module.exports = userController;
