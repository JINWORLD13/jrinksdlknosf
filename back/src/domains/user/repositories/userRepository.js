const User = require("../models/user");
const { commonErrors, wrapError } = require("../../../common/errors");
const userRepository = {
  create: async (userInfo) => {
    try {
      const newUser = await User?.create(userInfo);
      return newUser?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.userDAOCreateError);
    }
  },

  findByEmail: async (email) => {
    try {
      const plainUser = await User?.findOne({ email })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userDAOFindByEmailError);
    }
  },

  findByObjId: async (userObjId) => {
    try {
      const plainUser = await User?.findOne({ _id: userObjId })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userRepositoryFindByObjIdError);
    }
  },
  findById: async (userId) => {
    try {
      const plainUser = await User?.findOne({ id: userId })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userRepositoryFindByIdError);
    }
  },

  updateOne: async (updatedUserInfo, session = null) => {
    try {
      const filter = { id: updatedUserInfo.id };
      const update = { ...updatedUserInfo };
      const option = { returnOriginal: false, session };

      const updatedUser = await User?.findOneAndUpdate(filter, update, option);
      return updatedUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userDAOUpdateOneError);
    }
  },

  deleteById: async (userId) => {
    try {
      const result = await User?.deleteOne({ id: userId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.userDAODeleteByIdError);
    }
  },

  deleteByIdAndReturnDeletedOne: async (userId) => {
    try {
      const result = await User?.findOneAndDelete({ id: userId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.userDAODeleteByIdError);
    }
  },

  findByIpAddress: async (ipAddress) => {
    try {
      const users = await User?.find({ ipAdd: ipAddress }).lean();
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.userRepositoryFindByIpAddressError);
    }
  },

  findByDeviceInfo: async (deviceInfo) => {
    try {
      const users = await User?.find({
        "userAgent.deviceType": deviceInfo.deviceType,
        "userAgent.os": deviceInfo.os,
        "userAgent.browser": deviceInfo.browser,
      }).lean();
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.userRepositoryFindByDeviceInfoError);
    }
  },

  countReferralsByReferrerId: async (referrerId) => {
    try {
      const count = await User?.countDocuments({ referredBy: referrerId });
      return count;
    } catch (err) {
      throw wrapError(err, commonErrors.userRepositoryCountReferralsError);
    }
  },
};

module.exports = userRepository;
