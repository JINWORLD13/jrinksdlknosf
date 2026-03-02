const { sanitizeObject, buildResponse } = require("../../../common/utils/util");
const AppError = require("../../../common/errors/AppError");
const commonErrors = require("../../../common/errors/commonErrors");
const { adminService } = require("../services");
const { userService } = require("../../user/services");

// js에서의 object 형태 3
const adminController = {
  async createAdmin(req, res, next) {
    try {
      const adminInfo = await userService.getUserById(req?.user);
      const newAdminInfo = { ...adminInfo, role: "admin" };
      const newAdmin = await adminService.createAdmin(newAdminInfo);
      res?.status(200).json(buildResponse(newAdmin, null, 200));
    } catch (err) {
      const customedError = new AppError(err.name, err.message, 401);
      next(customedError);
    }
  },

  async getAdminById(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminRole = await adminService.getAdminById(adminId).role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          // 404은 "Not Found"
          next(
            new AppError(
              commonErrors.adminControllerGetAdminByIdError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }
        return res.status(200).json(buildResponse(adminInDB, null, 200));
      } else {
        // 401은 "Unauthorized"
        next(
          new AppError(
            commonErrors.adminControllerGetAdminByIdError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },
  async getUserByEmail(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminRole = await adminService.getAdminById(adminId).role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const userEmail = req?.body.email;
        const userInDB = await adminService.getUserByEmail(userEmail, adminId);
        if (userInDB === undefined || userInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerGetUserByEmailError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }
        return res.status(200).json(buildResponse(userInDB, null, 200));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerGetUserByEmailError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },

  async getUsersByRole(req, res, next) {
    // 관리자가 전체 유저 조회해야 함
    // 여기에 토큰 체크하는 미들웨어 넣기
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminRole = await adminService.getAdminById(adminId).role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerGetUsersByRoleError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }
        let role = req?.body?.role;
        const userArrInDB = await adminService.getUsersByRole(role, adminId);
        res.status(200).json(buildResponse(userArrInDB, null, 200));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerGetUsersByRoleError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      // 403는 "Forbidden"(401과 다르게 클라이언트의 인증이 유효하지만 리소스에 대한 액세스가 거부)
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },

  async getAllUsers(req, res, next) {
    // 관리자가 전체 유저 조회해야 함
    // 여기에 토큰 체크하는 미들웨어 넣기
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminRole = await adminService.getAdminById(adminId).role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerGetAllUsersError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }
        const allInDB = await adminService.getAll();
        res?.status(200).json(buildResponse(allInDB, null, 200));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerGetAllUsersError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },

  async putAdmin(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminInfo = await adminService.getAdminById(adminId).role;
      const adminRole = await adminInfo.role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerPutAdminError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }

        const transfferedInfo = req?.body;
        // ? 빈값으로 업데이트 되지 않은 항목 거르기
        const updatedAdminDataArr = transfferedInfo?.filter(
          (elem) => elem?.length > 0
        );
        const updatedAdminInfo = { ...adminInfo, ...updatedAdminDataArr };
        const result = await adminService.updateUser(updatedAdminInfo);
        res?.status(200).json(buildResponse(result, null, 200));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerPutAdminError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },
  async putUser(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = adminId;
      const adminInfo = await adminService.getAdminById(adminId).role;
      const adminRole = await adminInfo.role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerPutUserError,
              commonErrors.adminInfoNotFoundError,
              404
            )
          );
        }
        const userEmail = req?.body?.email;
        const userInDB = await adminService.getUserByEmail(userEmail, adminId);
        const transfferedInfo = req?.body;
        // ? 빈값으로 업데이트 되지 않은 항목 거르기
        const updatedUserDataArr = transfferedInfo?.filter(
          (elem) => elem?.length > 0
        );
        const updatedUserInfo = { ...userInDB, ...updatedUserDataArr };
        const result = await adminService.updateUser(updatedUserInfo);
        res?.status(200).json(buildResponse(result, null, 200));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerPutUserError,
            commonErrors.forbiddenError,
            403
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, err.message, err.statusCode));
    }
  },

  // // ! 나중에 하기
  //         userEmailArr,
  //         adminId
  //       //! transfferedInfo에 email은 무조건 있음. 이걸로 사용자 찾아서 id찾기

  //       });


  // delete 버튼 누른다는 가정하에.
  async deleteAdminById(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user;
      const adminInfo = await adminService.getAdminById(adminId).role;
      const adminRole = await adminInfo.role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerDeleteAdminByIdError,
              "Not Found",
              404
            )
          );
        }
        await adminService.deleteAdminById(adminId);
        res?.status(204).json(buildResponse(null, null, 204)); //~ status(204)로 하면 응답값 출력 안됨. 로직은 처리가 됨.
      } else {
        next(
          new AppError(
            commonErrors.adminControllerDeleteAdminByIdError,
            "Unauthorized",
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, 401, err.message));
    }
  },

  async deleteUserByEmail(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user;
      const adminInfo = await adminService.getAdminById(adminId).role;
      const adminRole = await adminInfo.role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerDeleteUserByEmailError,
              "Not Found",
              404
            )
          );
        }
        const userEmail = req?.body.email;
        await adminService.deleteUserByEmail(userEmail, adminId);
        res?.status(204).json(buildResponse(null, null, 204)); //~ status(204)로 하면 응답값 출력 안됨. 로직은 처리가 됨.
      } else {
        next(
          new AppError(
            commonErrors.adminControllerDeleteUserByEmailError,
            "Unauthorized",
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, 401, err.message));
    }
  },

  async deleteUsersByEmail(req, res, next) {
    try {
      // 여기에 토큰 체크하는 미들웨어 넣기(관리자에겐 전체 권한)
      const adminId = req?.user;
      const adminInfo = await adminService.getAdminById(adminId).role;
      const adminRole = await adminInfo.role;
      if (req?.isAuthenticated() === true && adminRole === "admin") {
        const adminInDB = await adminService.getAdminById(adminId);
        if (adminInDB === undefined || adminInDB === null) {
          next(
            new AppError(
              commonErrors.adminControllerDeleteUsersByEmailError,
              "Not Found",
              404
            )
          );
        }
        const userEmailArr = req?.body.emails;
        await adminService.deleteUserByEmail(userEmailArr, adminId);

        const usersEmailArr = [...req?.body];
        await adminService.deleteUsersByEmail(usersEmailArr);
        res?.status(204).json(buildResponse(null, null, 204));
      } else {
        next(
          new AppError(
            commonErrors.adminControllerDeleteUsersByEmailError,
            "Unauthorized",
            401
          )
        );
      }
    } catch (err) {
      next(new AppError(err.name, 403, err.message));
    }
  },
};

module.exports = adminController;

// Contorller(프론트와 req, res를 이용해 Service의 함수로 값을 구해 처리)
// Controller : 입구컷
//         email,
//         name,
//         password,
//         address,
//         role
//       );
//       // TODO: 회원가입 직후 자동 로그인 기능 추가시 필요
//       // 항상 뭐든 에러가 날 수 있으니 에러 처리는 필수 - 형식적으로 해주는 작업
//       //     errorCode = 33
//       // }
//       // if(err.message == "이미 같은 email이 있어 가입하지 못합니다."){
//       //     err.name = commonErrors.authServiceCreateUserError;
//       //     errorCode = 26
//       // }
//       // if(err.message == "email 형식이 맞지 않습니다."){
//       //     err.name = commonErrors.authServiceCreateUserError;
//       //     errorCode = 29
//       // }
//       // if(err.message == "password 8자이상 입력해야 합니다."){
//       //     err.name = commonErrors.authServiceCreateUserError;
//       //     errorCode = 30
//       // }
//     }
//   },

//   // ! 토큰이 발급돼 있는 상태여야 하고 checkToken가 있어야 decode로 인해 요청.user는 존재하게 됨.

//       //     errorCode = 27
//       // }


//   // ! 토큰이 발급돼 있는 상태여야 하고 checkToken가 있어야 decode로 인해 요청.user는 존재하게 됨.




//   async getUsers(req, res, next) {
//     //! 관리자가 전체 유저 조회해야 함
//       //     errorCode = 33
//       // }
//       // if(err.message == `${role} 계정이 없습니다.`){
//       //     err.name = commonErrors.authServiceGetUsersError;
//       //     errorCode = 34
//           "토큰이 존재하지 않습니다.",
//         updatedEmail,
//         updatedName,
//         updatedPassword,
//         updatedAddress,
//         updatedRole,
//       } = req.body; //& 프론트엔드에서 INPUT태그 작성해야 함.
//       if (
//         updatedEmail === null ||
//         updatedName === null ||
//         updatedPassword === null ||
//         updatedAddress === null
//       ) {
//         throw new Error(
//           "빈 값을 채워주시길 바랍니다.",
//           updatedEmail,
//           updatedName,
//           updatedPassword,
//           updatedAddress,
//           updatedRole: "user",
//         });
//       }
//       if (req.user.role === "admin") {
//         user = await adminService.updateUser(id, {
//           updatedEmail,
//           updatedName,
//           updatedPassword,
//           updatedAddress,
//           updatedRole,







// module.exports = adminController;
