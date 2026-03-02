const DeletedUser = require("../models/deletedUser");
const { commonErrors, wrapError } = require("../../../common/errors");

const deletedUserRepository = {
  create: async (userInfo) => {
    try {
      const newDeletedUser = await DeletedUser?.create(userInfo);
      return newDeletedUser?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserRepositoryCreateError);
    }
  },

  findByEmail: async (email) => {
    try {
      const plainUser = await DeletedUser?.findOne({ email })?.lean(); // lean()은 순수 스키마 값만 줌(객체에서 메소드 말고 필드만)
      return plainUser; // plain이란 말도 순수 값이란 의미. 메소드 없음.
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserRepositoryFindByEmailError);
    }
  },

  findByObjId: async (userObjId) => {
    try {
      const plainUser = await DeletedUser?.findOne({ _id: userObjId })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserDAOFindByObjIdError);
    }
  },
  findById: async (userId) => {
    try {
      const plainUser = await DeletedUser?.findOne({ id: userId })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserRepositoryFindByIdError);
    }
  },

  updateOne: async (updatedUserInfo) => {
    try {
      const filter = { id: updatedUserInfo.id };
      const option = { returnOriginal: false };
      const update = { ...updatedUserInfo };

      const updatedUser = await DeletedUser?.findOneAndUpdate(
        filter,
        update,
        option,
      );
      return updatedUser;
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserDAOUpdateOneError);
    }
  },

  deleteById: async (userId) => {
    try {
      const result = await DeletedUser?.deleteOne({ id: userId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserRepositoryDeleteByIdError);
    }
  },

  deleteByIdAndReturnDeletedOne: async (userId) => {
    try {
      const result = await DeletedUser?.findOneAndDelete({ id: userId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.deletedUserRepositoryDeleteByIdError);
    }
  },
};

module.exports = deletedUserRepository;
