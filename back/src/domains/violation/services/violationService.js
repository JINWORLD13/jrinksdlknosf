const { violationRepository } = require("../repositories/index");
const {
  commonErrors,
  wrapError,
  createError,
} = require("../../../common/errors");
const mongoose = require("mongoose");

class ViolationService {
  // 생성
  // 作成
  // Create
  async createViolation(violationInfo) {
    if (!violationInfo || !violationInfo.orderId || !violationInfo.userObjId) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    if (
      violationInfo.userObjId !== "N.A" &&
      !mongoose.Types.ObjectId.isValid(violationInfo.userObjId)
    ) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const violationInDB = await violationRepository.findByOrderId(
        violationInfo.orderId,
      );
      if (violationInDB) {
        throw createError(commonErrors.violationPreInfoConflictError, {
          statusCode: 409,
        });
      }
      return await violationRepository.create(violationInfo);
    } catch (err) {
      throw wrapError(err, commonErrors.violationServiceCreateViolation, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 단건 조회 (ObjId)
  // 単発照会 (ObjId)
  // Single search (ObjId)
  async getViolationByObjId(objId) {
    if (!mongoose.Types.ObjectId.isValid(objId)) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const violation = await violationRepository.findByObjId(objId);
      if (!violation) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      return violation;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceGetViolationByObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 단건 조회 (orderId)
  // 単発照회 (orderId)
  // Single search (orderId)
  async getViolationByOrderId(orderId) {
    if (!orderId)
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    try {
      const violation = await violationRepository.findByOrderId(orderId);
      if (!violation) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      return violation;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceGetViolationByOrderIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 목록 조회 (userObjId)
  // 一覧照会 (userObjId)
  // List search (userObjId)
  async getViolationsByUserObjId(userObjId) {
    if (!mongoose.Types.ObjectId.isValid(userObjId)) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const arr = await violationRepository.findManyByUserObjId(userObjId);
      if (!arr || arr.length === 0) {
        throw createError(commonErrors.violationsInfoNotFoundError, {
          statusCode: 404,
        });
      }
      return arr;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceGetViolationsByUserObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 단건 삭제 (ObjId)
  // 単発削除 (ObjId)
  // Single delete (ObjId)
  async deleteViolationByObjId(objId) {
    if (!mongoose.Types.ObjectId.isValid(objId)) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const violation = await violationRepository.findByObjId(objId);
      if (!violation) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      return await violationRepository.deleteByObjId(objId);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceDeleteViolationByObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 단건 삭제 (orderId)
  // 単発削除 (orderId)
  // Single delete (orderId)
  async deleteViolationByOrderId(orderId) {
    if (!orderId)
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    try {
      const violation = await violationRepository.findByOrderId(orderId);
      if (!violation) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      return await violationRepository.deleteByObjId(violation._id);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceDeleteViolationByOrderIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (userObjId)
  // 一括削除 (userObjId)
  // Bulk delete (userObjId)
  async deleteViolationsByUserObjId(userObjId) {
    if (!mongoose.Types.ObjectId.isValid(userObjId)) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const arr = await violationRepository.findManyByUserObjId(userObjId);
      if (!arr || arr.length === 0) {
        throw createError(commonErrors.violationsInfoNotFoundError, {
          statusCode: 404,
        });
      }
      return await violationRepository.deleteManyByUserObjId(userObjId);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceDeleteViolationsByUserObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  // 일괄 삭제 (ObjIdArr)
  // 一括削除 (ObjIdArr)
  // Bulk delete (ObjIdArr)
  async deleteViolationsByObjIdArr(objIdArr) {
    if (!Array.isArray(objIdArr) || objIdArr.length === 0) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    if (!objIdArr.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const arr = await violationRepository.findByObjIdArr(objIdArr);
      if (!arr || arr.length === 0) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      return await violationRepository.deleteByObjIdArr(objIdArr);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServiceDeleteViolationsByObjIdArrError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }

  async putViolationByOrderId(orderId, updateForm) {
    if (!orderId) {
      throw wrapError(
        new Error(commonErrors.argumentError),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }
    if (!updateForm || typeof updateForm !== "object") {
      throw wrapError(
        new Error(commonErrors.argumentError),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }
    try {
      const violation = await violationRepository.findByOrderId(orderId);
      if (!violation) {
        throw wrapError(
          new Error(commonErrors.violationNotFoundError),
          commonErrors.violationNotFoundError,
          { statusCode: 404 },
        );
      }
      return await violationRepository.updateByObjId(violation._id, updateForm);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServicePutViolationByOrderIdError,
      );
    }
  }

  // 단건 수정 (userObjId)
  // 単発修正 (userObjId)
  // Single update (userObjId)
  async putViolationByUserObjId(userObjId, updateForm) {
    if (!mongoose.Types.ObjectId.isValid(userObjId)) {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    if (!updateForm || typeof updateForm !== "object") {
      throw createError(commonErrors.argumentError, { statusCode: 400 });
    }
    try {
      const arr = await violationRepository.findManyByUserObjId(userObjId);
      if (!arr || arr.length === 0) {
        throw createError(commonErrors.violationNotFoundError, {
          statusCode: 404,
        });
      }
      // 첫 번째 것만 업데이트
      // 最初のものだけ更新
      // Update only the first one
      return await violationRepository.updateByObjId(arr[0]._id, updateForm);
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.violationServicePutViolationByUserObjIdError,
        {
          statusCode: err.statusCode || 500,
        },
      );
    }
  }
}

const violationService = new ViolationService();
module.exports = violationService;
