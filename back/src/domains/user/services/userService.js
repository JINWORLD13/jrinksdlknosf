const { userRepository } = require("../repositories/index");
const {
  commonErrors,
  wrapError,
  createError,
} = require("../../../common/errors");

class UserService {
  // 사용자 생성
  // ユーザー作成
  // Create user
  async createUser(userInfo) {
    try {
      const userInDB = await userRepository.findById(userInfo.id);
      if (userInDB !== null && userInDB !== undefined) {
        throw createError(commonErrors.userConflictError, { statusCode: 409 });
      } else {
        const newUser = await userRepository.create(userInfo);
        return newUser;
      }
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceCreateError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 사용자 조회 (ObjId 기준)
  // ユーザー照회 (ObjId 基準)
  // Get user by ObjId
  async getUserByObjId(userObjId) {
    try {
      const userInDB = await userRepository.findByObjId(userObjId);
      if (!userInDB) {
        throw createError(commonErrors.userNotFoundError, { statusCode: 404 });
      }
      return userInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceGetUserByObjIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
  // 사용자 조회 (ID 기준)
  // ユーザー照会 (ID 基準)
  // Get user by ID
  async getUserById(userId) {
    try {
      const userInDB = await userRepository.findById(userId);
      if (!userInDB) {
        throw createError(commonErrors.userNotFoundError, { statusCode: 404 });
      }
      return userInDB;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceGetUserByIdError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 사용자 정보 수정
  // ユーザー情報修正
  // Update user info
  async updateUser(updatedUserInfo, session = null) {
    try {
      const userId = updatedUserInfo.id;
      const userInDB = await userRepository.findById(userId);
      if (userInDB === undefined || userInDB === null) {
        throw createError(commonErrors.userNotFoundError, { statusCode: 404 });
      }
      const updatedUser = await userRepository.updateOne(
        updatedUserInfo,
        session,
      );
      return updatedUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceUpdateUserError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 사용자 삭제
  // ユーザー削除
  // Delete user
  async deleteUser(userInfo) {
    try {
      const userInDB = await userRepository.findById(userInfo.id);
      if (userInDB === null || userInDB === undefined) {
        throw createError(commonErrors.userNotFoundError, { statusCode: 404 });
      }
      const deletedUser = await userRepository.deleteByIdAndReturnDeletedOne(
        userInfo.id,
      );
      return deletedUser;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceDeleteUserError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // IP 주소별 사용자 조회
  // IPアドレス別ユーザー照会
  // Get users by IP address
  async getUsersByIpAddress(ipAddress) {
    try {
      const users = await userRepository.findByIpAddress(ipAddress);
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceGetUsersByIpAddressError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 기기 정보별 사용자 조회
  // 機器情報別ユーザー照会
  // Get users by device info
  async getUsersByDeviceInfo(deviceInfo) {
    try {
      const users = await userRepository.findByDeviceInfo(deviceInfo);
      return users;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceGetUsersByDeviceInfoError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 추천인 ID 기준 추천 횟수 조회
  // 推薦人ID基準の推薦回数照会
  // Get referral count by referrer ID
  async getReferralCountByReferrerId(referrerId) {
    try {
      const count = await userRepository.countReferralsByReferrerId(referrerId);
      return count;
    } catch (err) {
      throw wrapError(err, commonErrors.userServiceGetReferralCountError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
}
const userService = new UserService();

module.exports = userService;
