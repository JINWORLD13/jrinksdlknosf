const User = require("../../user/models/user");
const { commonErrors, wrapError } = require("../../../common/errors");

const adminRepository = {
  create: async (adminInfo) => {
    try {
      const newAdmin = await User?.create(adminInfo);
      return newAdmin?.toObject();
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryCreateError);
    }
  },

  findByEmail: async (email) => {
    try {
      const plainUser = await User?.findOne({ email })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryFindByEmailError);
    }
  },

  findManyByEmailArr: async (emailArr) => {
    try {
      const foundUsers = await emailArr.map((email, i) => {
        const plainUser = User?.findOne({ email })?.lean();
        return plainUser;
      });
      return foundUsers;
    } catch (err) {
      throw wrapError(err, commonErrors.adminDAOFindManyByEmailArrError);
    }
  },

  findById: async (userId) => {
    try {
      const plainUser = await User?.findOne({ id: userId })?.lean();
      return plainUser;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryFindByIdError);
    }
  },

  findManyByEmail: async (usersEmailArr) => {
    try {
      const usersArrByEmail = await User?.find({
        email: { $in: usersEmailArr },
      })?.lean();
      return usersArrByEmail;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryFindManyByEmailError);
    }
  },
  findManyByRole: async (userRole) => {
    try {
      const users = await User?.find({ role: userRole });
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryFindManyByRoleError);
    }
  },

  findAll: async () => {
    try {
      const users = await User?.find({});
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.adminDAOFindAllError);
    }
  },

  updateOne: async (updatedUserInfo) => {
    try {
      const filter = { id: updatedUserInfo.id };
      const option = { returnOriginal: false };
      const update = { ...updatedUserInfo };

      const updatedUser = await User?.findOneAndUpdate(filter, update, option);
      return updatedUser;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryUpdateOneError);
    }
  },

  updateMany: async (updatedUserArr) => {
    try {
      const updatedUsersArr = [];
      await updatedUserArr.map((updatedUserInfo, i) => {
        const filter = { id: updatedUserInfo.id };
        const option = { returnOriginal: false };
        const update = { ...updatedUserInfo };
        const updatedUser = User?.findOneAndUpdate(filter, update, option);
        updatedUsersArr.push(updatedUser);
      });
      return updatedUsersArr;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryUpdateOneError);
    }
  },

  deleteById: async (userId) => {
    try {
      const result = await User?.deleteOne({ id: userId });
      return result;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryDeleteByIdError);
    }
  },

  deleteManyById: async (userIdArr) => {
    try {
      const delectedUsers = await userIdArr.map((userId, i) => {
        const result = User?.deleteOne({ id: userId });
        return result;
      });
      return delectedUsers;
    } catch (err) {
      throw wrapError(err, commonErrors.adminRepositoryDeleteManyByIdError);
    }
  },
};

module.exports = adminRepository;
