const { deletedUserRepository } = require("../repositories/index");
const { commonErrors, wrapError } = require("../../../common/errors");
class DeletedUserService {
  async createUser(userInfo) {
    try {
      const deletedUserInDB = await deletedUserRepository.findByObjId(
        userInfo?._id,
      );
      if (deletedUserInDB !== null && deletedUserInDB !== undefined) {
        throw new Error(commonErrors.deletedUserInfoConflictError);
      } else {
        const newDeletedUser = await deletedUserRepository.create(userInfo);
        return newDeletedUser;
      }
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.deletedUserServiceCreateError,
        err.message === commonErrors.deletedUserInfoConflictError
          ? { statusCode: 409 }
          : {},
      );
    }
  }

  async getUserByObjId(userObjId) {
    try {
      const deletedUserInDB =
        await deletedUserRepository.findByObjId(userObjId);
      return deletedUserInDB;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.deletedUserServiceGetUserByObjIdError,
        err.message === commonErrors.deletedUserInfoNotFoundError
          ? { statusCode: 404 }
          : {},
      );
    }
  }
  async getUserById(userId) {
    try {
      const deletedUserInDB = await deletedUserRepository.findById(userId);
      return deletedUserInDB;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.deletedUserServiceGetUserByIdError,
        err.message === commonErrors.deletedUserInfoNotFoundError
          ? { statusCode: 404 }
          : {},
      );
    }
  }

  async updateUser(updatedUserInfo) {
    try {
      const userId = updatedUserInfo.id;
      const deletedUserInDB = await deletedUserRepository.findById(userId);
      if (deletedUserInDB === undefined || deletedUserInDB === null) {
        throw new Error(commonErrors.deletedUserInfoNotFoundError);
      }
      const updatedUser =
        await deletedUserRepository.updateOne(updatedUserInfo);
      return updatedUser;
    } catch (err) {
      if (err.name === commonErrors.deletedUserRepositoryUpdateOneError)
        throw err;
      throw wrapError(
        err,
        commonErrors.deletedUserServiceUpdateUserError,
        err.message === commonErrors.deletedUserInfoNotFoundError
          ? { statusCode: 404 }
          : {},
      );
    }
  }

  async deleteUser(userInfo) {
    try {
      const deletedUserInDB = await deletedUserRepository.findById(userInfo.id);
      if (deletedUserInDB === null || deletedUserInDB === undefined) {
        throw new Error(commonErrors.deletedUserInfoNotFoundError);
      }
      const deletedUser =
        await deletedUserRepository.deleteByIdAndReturnDeletedOne(userInfo.id);
      return deletedUser;
    } catch (err) {
      throw wrapError(
        err,
        commonErrors.deletedUserServiceDeleteUserError,
        err.message === commonErrors.adminInfoNotFoundError
          ? { statusCode: 404 }
          : {},
      );
    }
  }
}
const deletedUserService = new DeletedUserService();

module.exports = deletedUserService;
