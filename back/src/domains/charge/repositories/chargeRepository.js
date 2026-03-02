const Charge = require("../models/charge");
const { commonErrors, wrapError } = require("../../../common/errors");

const chargeRepository = {
  createPreChargeForToss: async (preChargeInfoForToss) => {
    try {
      const userObjId = preChargeInfoForToss?.userId?._id ?? null;
      const {
        orderId,
        paymentKey,
        orderName,
        orderHistory,
        orderVouchers,
        refundReceiveAccount,
        amount,
        currency,
        country,
        method,
        apiName,
        userId,
        ...rest
      } = preChargeInfoForToss;
      // populate시, 연결할 데이터의 ObjId를 쓰면 되는 거임.
      let newCharge;
      if (method === "가상계좌") {
        newCharge = new Charge({
          orderId,
          paymentKey,
          orderName,
          orderHistory,
          orderVouchers,
          refundReceiveAccount,
          amount,
          currency,
          country,
          method,
          apiName,
          userId: userObjId,
          ...rest,
        });
      } else if (method !== "가상계좌") {
        newCharge = new Charge({
          orderId,
          paymentKey,
          orderName,
          orderHistory,
          orderVouchers,
          amount,
          currency,
          country,
          method,
          apiName,
          userId: userObjId,
          ...rest,
        });
      }
      await newCharge.save();

      // Charge 데이터를 가져와 userId 필드를 populate하여 실제 데이터로 채워줌
      // populate("Charge 스키마에서 다른 스키마를 연결한 부분에 쓴 (다른 스키마의 ) OBJECT ID키값")
      const populatedCharge = await Charge?.findOne({
        _id: newCharge?._id,
      }).populate("userId");
      return populatedCharge?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOCreateError);
    }
  },
  createChargeForGooglePlay: async (preChargeInfoForToss) => {
    try {
      const userObjId = preChargeInfoForToss?.userId?._id ?? null;
      const {
        orderId,
        orderName,
        orderHistory,
        orderVouchers,
        amount,
        apiName,
        userId,
        createdAtForIAP,
        ...rest
      } = preChargeInfoForToss;
      // populate시, 연결할 데이터의 ObjId를 쓰면 되는 거임.
      const newCharge = new Charge({
        orderId,
        orderName,
        orderHistory,
        orderVouchers,
        amount,
        apiName,
        userId: userObjId,
        createdAtForIAP,
        ...rest,
      });
      await newCharge.save();

      // Charge 데이터를 가져와 userId 필드를 populate하여 실제 데이터로 채워줌
      // populate("Charge 스키마에서 다른 스키마를 연결한 부분에 쓴 (다른 스키마의 ) OBJECT ID키값")
      const populatedCharge = await Charge?.findOne({
        _id: newCharge?._id,
      }).populate("userId");
      return populatedCharge?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOCreateError);
    }
  },

  findManyByProductId: async (productId) => {
    try {
      const plainChargeArr = await Charge?.find({
        productId: productId,
      })?.lean();
      return plainChargeArr;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryFindManyByProductIdError);
    }
  },

  findByObjId: async (chargeObjId) => {
    try {
      const plainCharge = await Charge?.findOne({
        _id: chargeObjId,
      })?.lean();
      return plainCharge;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOFindByObjIdError);
    }
  },

  findByObjIdArr: async (chargeObjIdArr) => {
    try {
      const resultArr = await Charge?.find({
        _id: { $in: chargeObjIdArr },
      })?.lean();
      return resultArr;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryFindByObjIdArrError);
    }
  },

  findByOrderId: async (orderId) => {
    try {
      const plainCharge = await Charge?.findOne({
        orderId: orderId,
      })?.lean();
      return plainCharge || undefined;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOFindByOrderIdError);
    }
  },

  findByPurchaseToken: async (purchaseToken) => {
    try {
      if (!purchaseToken) return undefined;
      const plainCharge = await Charge?.findOne({
        purchaseToken: purchaseToken,
      })?.lean();
      return plainCharge || undefined;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOFindByOrderIdError);
    }
  },

  findByUserObjId: async (userObjId) => {
    try {
      const plainCharge = await Charge?.findOne({
        userId: userObjId,
      })?.lean();
      return plainCharge;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryFindByUserObjIdError);
    }
  },

  findManyByUserObjId: async (userObjId) => {
    try {
      // populate된 부분은 ObjId로 찾아야 함.
      const plainChargeArr = await Charge?.find({ userId: userObjId });
      const plainChargeArrWithoutObjIdAndUserObjId = plainChargeArr.map(
        (charge, i) => {
          const {
            orderId,
            orderName,
            paymentKey,
            amount,
            currency,
            createdAt,
            updatedAt,
            ...rest
          } = charge;
          return {
            orderId,
            orderName,
            paymentKey,
            amount,
            currency,
            createdAt,
            updatedAt,
          };
        },
      );
      return plainChargeArrWithoutObjIdAndUserObjId;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryFindManyByUserObjIdError);
    }
  },

  findManyByCurrency: async (currency) => {
    try {
      const plainChargeArr = await Charge?.find({
        currency: currency,
      })?.lean();
      return plainChargeArr;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAOFindManyByCurrencyError);
    }
  },

  deleteByObjId: async (chargeObjId, session = null) => {
    try {
      const result = await Charge?.deleteOne({ _id: chargeObjId }, { session });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryDeleteByObjIdError);
    }
  },

  deleteByObjIdArr: async (chargeObjIdArr, session = null) => {
    try {
      const result = await Charge?.deleteMany(
        { _id: { $in: chargeObjIdArr } },
        { session },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryDeleteByObjIdError);
    }
  },

  deleteManyByUserObjId: async (userObjId, session = null) => {
    try {
      const result = await Charge?.deleteMany(
        { userId: userObjId },
        { session },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryDeleteManyByUserObjIdError);
    }
  },

  deleteManyByUserObjIdAndPaymentKey: async (
    userObjId,
    paymentKey,
    session = null,
  ) => {
    try {
      const result = await Charge?.deleteMany(
        {
          userId: userObjId,
          paymentKey: paymentKey,
        },
        { session },
      );
      return result;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.chargeRepositoryDeleteManyByUserObjIdAndPaymentKeyError,
      );
    }
  },

  deleteAll: async () => {
    try {
      const result = await Charge?.deleteMany({});
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeDAODeleteAllError);
    }
  },

  updateByObjId: async (chargeObjId, updateForm, session = null) => {
    try {
      const result = await Charge?.updateOne(
        { _id: chargeObjId },
        { ...updateForm },
        { session },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryUpdateByObjIdError);
    }
  },

  updateByUserObjId: async (userObjId, updateForm, session = null) => {
    try {
      const result = await Charge?.updateOne(
        { userId: userObjId },
        { ...updateForm },
        { session },
      );
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.chargeRepositoryUpdateByUserObjIdError);
    }
  },
};

module.exports = chargeRepository;
