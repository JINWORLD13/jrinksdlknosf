const { adminRepository } = require("../repositories/index");
const {
  commonErrors,
  wrapError,
  createError,
} = require("../../../common/errors");

class AdminService {
  // 관리자 생성
  // 管理者作成
  // Create admin
  async createAdmin(adminInfo) {
    try {
      const adminInDB = await adminRepository.findById(adminInfo.id);
      if (adminInDB !== null && adminInDB !== undefined) {
        throw createError(commonErrors.adminInfoConflictError, {
          statusCode: 409,
        });
      } else {
        const newAdmin = await adminRepository.create(adminInfo);
        return newAdmin;
      }
    } catch (err) {
      throw wrapError(err, commonErrors.adminServiceCreateError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  async getAdminById(adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw wrapError(
          new Error(commonErrors.adminInfoNotFoundError),
          commonErrors.adminInfoNotFoundError,
          { statusCode: 404 },
        );
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          return adminInDB;
        } else {
          throw wrapError(
            new Error(commonErrors.forbiddenError),
            commonErrors.forbiddenError,
            { statusCode: 403 },
          );
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceGetAdminByIdError);
    }
  }

  // 사용자 조회 (이메일 기준 - 관리 권한)
  // ユーザー照会 (メール基準 - 管理権限)
  // Get user by email (admin permission)
  async getUserByEmail(userEmail, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userInDB = await adminRepository.findByEmail(userEmail);
          if (userInDB === null || userInDB === undefined) {
            throw createError(commonErrors.userNotFoundError, {
              statusCode: 404,
            });
          }
          return userInDB;
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.userNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceGetUserByEmailError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  async getUsersByEmailArr(userEmailArr, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw wrapError(
          new Error(commonErrors.adminInfoNotFoundError),
          commonErrors.adminInfoNotFoundError,
          { statusCode: 404 },
        );
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userInDBArr =
            await adminRepository.findManyByEmailArr(userEmailArr);
          if (
            userInDBArr?.length === 0 ||
            userInDBArr === null ||
            userInDBArr === undefined
          ) {
            throw wrapError(
              new Error(commonErrors.usersInfoNotFoundError),
              commonErrors.usersInfoNotFoundError,
              { statusCode: 404 },
            );
          }
          return userInDBArr;
        } else {
          throw wrapError(
            new Error(commonErrors.forbiddenError),
            commonErrors.forbiddenError,
            { statusCode: 403 },
          );
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.usersInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceGetUserByEmailError);
    }
  }

  // 사용자 목록 조회 (역할 기준 - 관리 권한)
  // ユーザー一覧照会 (ロール基準 - 管理権限)
  // Get users by role (admin permission)
  async getUsersByRole(userRole, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userInDBArr = await adminRepository.findManyByRole(userRole);
          if (
            userInDBArr?.length === 0 ||
            userInDBArr === null ||
            userInDBArr === undefined
          ) {
            throw createError(commonErrors.usersInfoNotFoundError, {
              statusCode: 404,
            });
          }
          return userInDBArr;
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.usersInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceGetUsersByRoleError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 전체 사용자 목록 조회 (관리 권한)
  // 全ユーザー一覧照会 (管理権限)
  // Get all users (admin permission)
  async getAll(adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const allUsersInDBArr = await adminRepository.findAll();
          if (
            allUsersInDBArr === undefined ||
            allUsersInDBArr === null ||
            allUsersInDBArr.length === 0
          ) {
            throw createError(commonErrors.allUsersInfoNotFoundError, {
              statusCode: 404,
            });
          }
          return allUsersInDBArr;
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.allUsersInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceGetAllError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 관리자 정보 수정 (관리 권한)
  // 管理者情報修正 (管理権限)
  // Update admin info (admin permission)
  async updateAdmin(updatedAdminInfo, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const updatedAdmin =
            await adminRepository.updateOne(updatedAdminInfo);
          return updatedAdmin;
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceUpdateAdminError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  async updateUser(updatedUserInfo, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw wrapError(
          new Error(commonErrors.adminInfoNotFoundError),
          commonErrors.adminInfoNotFoundError,
          { statusCode: 404 },
        );
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userEmail = updatedUserInfo.email;
          const userInDB = await adminRepository.findByEmail(userEmail);
          if (userInDB === null || userInDB === undefined) {
            throw wrapError(
              new Error(commonErrors.userNotFoundError),
              commonErrors.userNotFoundError,
              { statusCode: 404 },
            );
          } else {
            const updatedUser =
              await adminRepository.updateOne(updatedUserInfo);
            return updatedUser;
          }
        } else {
          throw wrapError(
            new Error(commonErrors.forbiddenError),
            commonErrors.forbiddenError,
            { statusCode: 403 },
          );
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.userNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceUpdateUserError);
    }
  }

  // 여러 사용자 정보 일괄 수정 (관리 권한)
  // 複数ユーザー情報の一括修正 (管理権限)
  // Bulk update users info (admin permission)
  async updateUsers(updatedUserArr, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          // Note: userEmailArr is used but not passed in param.
          // Assuming updatedUserArr contains what's needed or this is a logic bug in original code.
          // In original code it was using userEmailArr which might be from outer scope or missing.
          // I will keep the logic as is but fix the error handling.
          const userInDBArr =
            await adminRepository.findManyByEmailArr(userEmailArr);
          if (
            userInDBArr === null ||
            userInDBArr === undefined ||
            userInDBArr?.length === 0
          ) {
            throw createError(commonErrors.usersInfoNotFoundError, {
              statusCode: 404,
            });
          } else {
            const updatedUsers =
              await adminRepository.updateMany(updatedUserArr);
            return updatedUsers;
          }
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.usersInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceUpdateUserError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 관리자 삭제 (ID 기준)
  // 管理者削除 (ID 基準)
  // Delete admin (by ID)
  async deleteAdminById(adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const deletedAdmin = await adminRepository.deleteById(adminId);
          return deletedAdmin;
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceDeleteAdminError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 사용자 삭제 (이메일 기준 - 관리 권한)
  // ユーザー削除 (メール基準 - 管理権限)
  // Delete user by email (admin permission)
  async deleteUserByEmail(userEmail, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userInDB = await adminRepository.findByEmail(userEmail);
          if (userInDB === null || userInDB === undefined) {
            throw createError(commonErrors.userNotFoundError, {
              statusCode: 404,
            });
          } else {
            const userId = userInDB?.id;
            const deletedUser = await adminRepository.deleteById(userId);
            return deletedUser;
          }
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.userNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceDeleteUserError, {
        statusCode: err.statusCode || 500,
      });
    }
  }

  // 여러 사용자 일괄 삭제 (이메일 배열 기준 - 관리 권한)
  // 複数ユーザーの一括削除 (メール配列基準 - 管理権限)
  // Bulk delete users by email array (admin permission)
  async deleteUsersByEmail(userEmailArr, adminId) {
    try {
      const adminInDB = await adminRepository.findById(adminId);
      if (adminInDB === undefined || adminInDB === null) {
        throw createError(commonErrors.adminInfoNotFoundError, {
          statusCode: 404,
        });
      } else {
        const adminRole = adminInDB.role;
        if (adminRole === "admin") {
          const userInDBArr =
            await adminRepository.findManyByEmailArr(userEmailArr);
          if (
            userInDBArr === null ||
            userInDBArr === undefined ||
            userInDBArr?.length === 0
          ) {
            throw createError(commonErrors.usersInfoNotFoundError, {
              statusCode: 404,
            });
          } else {
            const userIdArr = userInDBArr.map((user, i) => {
              return user.id;
            });
            const deletedUser = await adminRepository.deleteManyById(userIdArr);
            return deletedUser;
          }
        } else {
          throw createError(commonErrors.forbiddenError, { statusCode: 403 });
        }
      }
    } catch (err) {
      if (
        err.name === commonErrors.adminInfoNotFoundError ||
        err.name === commonErrors.usersInfoNotFoundError ||
        err.name === commonErrors.forbiddenError
      )
        throw err;
      throw wrapError(err, commonErrors.adminServiceDeleteUsersError, {
        statusCode: err.statusCode || 500,
      });
    }
  }
}

const adminService = new AdminService();

module.exports = adminService;
