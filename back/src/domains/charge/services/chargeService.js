const { chargeRepository } = require("../repositories/index");
const { userRepository } = require("../../user/repositories/index");
const {
  commonErrors,
  wrapError,
  createError,
} = require("../../../common/errors");

class ChargeService {
  // Toss 선결제 정보 생성
  // Toss 前決済情報の作成
  // Create Toss pre-payment info
  async createChargeForTossPrePayment(chargePreInfo) {
    try {
      const chargeInDB = await chargeRepository.findByOrderId(
        chargePreInfo?.orderId,
      );
      if (chargeInDB !== null && chargeInDB !== undefined) {
        throw createError(commonErrors.chargePreInfoConflictError, {
          statusCode: 409,
        });
      } else {
        const newCharge =
          await chargeRepository.createPreChargeForToss(chargePreInfo);
        return newCharge;
      }
    } catch (err) {
      // Mongoose ValidationError handling
      if (err.name === "ValidationError") {
        throw err;
      }

      throw wrapError(
        err,
        commonErrors.chargeServiceCreateChargeForTossPrePayment,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }
  // Google Play 결제 정보 생성 (안드로이드)
  // Google Play 決済情報の作成 (Android)
  // Create Google Play payment info (Android)
  async createChargeForAndroidGooglePlay(chargePreInfo) {
    try {
      const chargeInDB = await chargeRepository.findByOrderId(
        chargePreInfo?.orderId,
      );
      if (chargeInDB !== null && chargeInDB !== undefined) {
        throw createError(commonErrors.chargePreInfoConflictError, {
          statusCode: 409,
        });
      } else {
        const newCharge =
          await chargeRepository.createChargeForGooglePlay(chargePreInfo);
        return newCharge;
      }
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.chargeServiceCreateChargeForAndroidGooglePlay,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 단건 조회 (ObjId 기준)
  // 単発照会 (ObjId 基準)
  // Single search by ObjId
  async getChargeByObjId(chargeObjId) {
    try {
      const chargeInDB = await chargeRepository.findByObjId(chargeObjId);
      return chargeInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServiceGetChargeByObjIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 목록 조회 (ProductId 기준)
  // 一覧照会 (ProductId 基準)
  // List search by ProductId
  async getChargesByProductId(productId) {
    try {
      const chargeInDB = await chargeRepository.findManyByProductId(productId);
      return chargeInDB;
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindManyByProductIdError)
        throw err;
      throw wrapError(
        err,
        commonErrors.chargeServiceGetChargesByProductIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }
  // 단건 조회 (OrderId 기준)
  // 単発照会 (OrderId 基準)
  // Single search by OrderId
  async getChargeByOrderId(orderId) {
    try {
      const chargeInDB = await chargeRepository.findByOrderId(orderId);
      return chargeInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServiceGetChargeByOrderIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 단건 조회 (PurchaseToken 기준)
  // 単発照会 (PurchaseToken 基準)
  // Single search by PurchaseToken
  async getChargeByPurchaseToken(purchaseToken) {
    try {
      if (!purchaseToken) return undefined;
      const chargeInDB =
        await chargeRepository.findByPurchaseToken(purchaseToken);
      return chargeInDB;
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindByOrderIdError)
        throw err;
      throw wrapError(err, commonErrors.chargeServiceGetChargeByOrderIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  //& 초기 결제에서만 쓰이는 것.
  async getChargeByUserObjId(userObjId) {
    try {
      const chargeInDB = await chargeRepository.findByUserObjId(userObjId);
      return chargeInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServiceGetChargeByUserObjIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 목록 조회 (userObjId 기준)
  // 一覧照会 (userObjId 基準)
  // List search by userObjId
  async getChargesByUserObjId(userObjId) {
    try {
      const chargeArrInDB =
        await chargeRepository.findManyByUserObjId(userObjId);
      return chargeArrInDB;
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindManyByUserObjIdError)
        throw err;
      throw wrapError(
        err,
        commonErrors.chargeServiceGetChargesByUserObjIdError,
        {
          statusCode:
            err.message === commonErrors.chargesInfoNotFoundError
              ? 404
              : err.statusCode || 500,
        },
      );
    }
  }

  // 목록 조회 (통화 기준)
  // 一覧照会 (通貨 基準)
  // List search by currency
  async getChargesByCurrency(currency) {
    try {
      const chargeArrInDB = await chargeRepository.findManyByCurrency(currency);
      return chargeArrInDB;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.chargeServiceGetChargesByCurrencyError,
        {
          statusCode:
            err.message === commonErrors.chargesInfoNotFoundError
              ? 404
              : err.statusCode || 500,
        },
      );
    }
  }

  // 단건 삭제 (OrderId 기준)
  // 単発削除 (OrderId 基準)
  // Single delete by OrderId
  async deleteChargeByOrderId(orderId, session = null) {
    try {
      const chargeInDB = await chargeRepository.findByOrderId(orderId);
      if (chargeInDB !== null && chargeInDB !== undefined) {
        const deletedCharge = await chargeRepository.deleteByObjId(
          chargeInDB._id,
          session,
        );
        return deletedCharge;
      } else {
        throw createError(commonErrors.chargeNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindByOrderIdError)
        throw err;
      if (err.name === commonErrors.chargeRepositoryDeleteByOrderIdError)
        throw err;
      throw wrapError(
        err,
        commonErrors.chargeServiceDeleteChargeByOrderIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }
  // 단건 삭제 (ObjId 기준)
  // 単発削除 (ObjId 基準)
  // Single delete by ObjId
  async deleteChargeByObjId(chargeObjId, session = null) {
    try {
      const chargeInDB = await chargeRepository.findByObjId(chargeObjId);
      if (chargeInDB !== null && chargeInDB !== undefined) {
        const deletedCharge = await chargeRepository.deleteByObjId(
          chargeInDB._id,
          session,
        );
        return deletedCharge;
      } else {
        throw createError(commonErrors.chargeNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServiceDeleteChargeByObjIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 일괄 삭제 (userObjId 기준)
  // 一括削除 (userObjId 基準)
  // Bulk delete by userObjId
  async deleteChargesByUserObjId(userObjId, session = null) {
    try {
      const chargeArrInDB =
        await chargeRepository.findManyByUserObjId(userObjId);
      if (chargeArrInDB !== null && chargeArrInDB !== undefined) {
        const result = await chargeRepository.deleteManyByUserObjId(
          userObjId,
          session,
        );
        return result;
      } else {
        throw createError(commonErrors.chargesInfoNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindManyByUserObjIdError)
        throw err;
      if (err.name === commonErrors.chargeRepositoryDeleteManyByObjIdError)
        throw err;
      throw wrapError(
        err,
        commonErrors.chargeServiceDeleteChargesByUserObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (userObjId 및 paymentKey 기준)
  // 一括削除 (userObjId および paymentKey 基準)
  // Bulk delete by userObjId and paymentKey
  async deleteChargeByUserObjIdAndPaymentKey(
    userObjId,
    paymentKey,
    session = null,
  ) {
    try {
      const chargeArrInDB =
        await chargeRepository.findManyByUserObjId(userObjId);
      if (chargeArrInDB !== null && chargeArrInDB !== undefined) {
        const result =
          await chargeRepository.deleteManyByUserObjIdAndPaymentKey(
            userObjId,
            paymentKey,
            session,
          );
        return result;
      } else {
        throw createError(commonErrors.chargesInfoNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.chargeServiceDeleteChargesByUserObjIdAndPaymentKeyError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (ObjId 배열 기준)
  // 一括削除 (ObjId 配列基準)
  // Bulk delete by ObjId array
  async deleteChargesByObjIdArr(chargeObjIdArr, session = null) {
    try {
      const chargeArrInDB =
        await chargeRepository.findByObjIdArr(chargeObjIdArr);
      if (
        chargeArrInDB !== null &&
        chargeArrInDB !== undefined &&
        chargeArrInDB.length > 0
      ) {
        const deletedCharge = await chargeRepository.deleteByObjIdArr(
          chargeObjIdArr,
          session,
        );
        return deletedCharge;
      } else {
        throw createError(commonErrors.chargeNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      if (err.name === commonErrors.chargeRepositoryFindByObjIdArrError)
        throw err;
      if (err.name === commonErrors.chargeRepositoryDeleteByObjIdError)
        throw err;
      throw wrapError(
        err,
        commonErrors.chargeServiceDeleteChargesByObjIdArrError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 수정 (OrderId 기준)
  // 修正 (OrderId 基準)
  // Update by OrderId
  async putChargeByOrderId(orderId, updateForm, session = null) {
    try {
      const chargeInDB = await chargeRepository.findByOrderId(orderId);
      if (chargeInDB !== null && chargeInDB !== undefined) {
        const updatedCharge = await chargeRepository.updateByObjId(
          chargeInDB._id,
          updateForm,
          session,
        );
        return updatedCharge;
      } else {
        throw createError(commonErrors.chargeNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServicePutChargeByOrderIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
  // 수정 (userObjId 기준)
  // 修正 (userObjId 基準)
  // Update by userObjId
  async putChargeByUserObjId(userObjId, updateForm, session = null) {
    try {
      const chargeInDB = await chargeRepository.findByUserObjId(userObjId);
      if (chargeInDB !== null && chargeInDB !== undefined) {
        const updatedCharge = await chargeRepository.updateByObjId(
          chargeInDB._id,
          updateForm,
          session,
        );
        return updatedCharge;
      } else {
        throw createError(commonErrors.chargeNotFoundError, {
          statusCode: 404,
        });
      }
    } catch (err) {
      throw wrapError(err, commonErrors.chargeServicePutChargeByObjIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
}
const chargeService = new ChargeService();

module.exports = chargeService;
