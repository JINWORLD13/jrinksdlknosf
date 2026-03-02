const Violation = require("../models/violation");
const { commonErrors, wrapError } = require("../../../common/errors");
const { sanitizeObject } = require("../../../common/utils/util");

const violationDAO = {
  create: async (form) => {
    try {
      const newViolation = new Violation({
        violationType: form?.violationType,
        orderId: form?.orderId,
        refundedAmount: form?.refundedAmount,
        remainingQuantity: form?.remainingQuantity,
        violationDate: form?.violationDate,
        violationDescription: form?.violationDescription,
        userId: form?.userObjId,
      });
      await newViolation.save();

      // Violation 데이터를 가져와 userId 필드를 populate하여 실제 데이터로 채워줌
      // populate("Violation 스키마에서 다른 스키마를 연결한 부분에 쓴 (다른 스키마의 ) OBJECT ID키값")
      const populatedViolation = await Violation?.findOne({
        _id: newViolation?._id,
      }).populate("userId");
      return populatedViolation?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryCreateError);
    }
  },

  findByObjId: async (violationObjId) => {
    try {
      const plainViolation = await Violation?.findOne({
        _id: violationObjId,
      })?.lean();
      return plainViolation;
    } catch (err) {
      throw wrapError(err, commonErrors.violationDAOFindByObjIdError);
    }
  },

  findByObjIdArr: async (violationObjIdArr) => {
    try {
      // Promise.all로 비동기 처리
      const resultArr = await Promise.all(
        violationObjIdArr.map((violationObjId) =>
          Violation?.findOne({ _id: violationObjId })?.lean(),
        ),
      );
      return resultArr;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryFindByObjIdArrError);
    }
  },

  findManyByUserObjId: async (userObjId) => {
    try {
      const plainViolationArr = await Violation?.find({ userId: userObjId });
      const plainViolationArrWithoutObjIdAndUserObjId = plainViolationArr.map(
        (violation, i) => {
          const { _id, userId, ...rest } = violation.toObject();
          return rest;
        },
      );
      return plainViolationArrWithoutObjIdAndUserObjId;
    } catch (err) {
      throw wrapError(err, commonErrors.violationDAOFindManyByUserObjIdError);
    }
  },

  // orderId로 단건 조회
  findByOrderId: async (orderId) => {
    try {
      const violation = await Violation?.findOne({ orderId })?.lean();
      return violation;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryFindByOrderIdError);
    }
  },

  deleteByObjId: async (violationObjId) => {
    try {
      const result = await Violation?.deleteOne({ _id: violationObjId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryDeleteByObjIdError);
    }
  },

  deleteByObjIdArr: async (violationObjIdArr) => {
    try {
      const result = await Violation?.deleteMany({
        _id: { $in: violationObjIdArr },
      });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryDeleteByObjIdError);
    }
  },

  deleteManyByUserObjId: async (userObjId) => {
    try {
      // deleteMany는 lean() 불필요
      const result = await Violation?.deleteMany({
        userId: userObjId,
      });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryDeleteManyByUserObjIdError);
    }
  },

  deleteAll: async () => {
    try {
      // deleteMany는 lean() 불필요
      const result = await Violation?.deleteMany({});
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryDeleteAllError);
    }
  },

  updateByObjId: async (violationObjId, updateForm) => {
    try {
      const result = await Violation?.updateOne(
        { _id: violationObjId },
        { ...updateForm },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationRepositoryUpdateByObjIdError);
    }
  },

  updateByUserObjId: async (userObjId, updateForm) => {
    try {
      const result = await Violation?.updateOne(
        { userId: userObjId },
        { ...updateForm },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.violationDAOUpdateByUserObjIdError);
    }
  },
};

module.exports = violationRepository;
