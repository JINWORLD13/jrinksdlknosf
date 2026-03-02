const commonErrors = {
  notFoundError: "Not Found Error", // 404
  adminInfoNotFoundError: "Admin Info Not Found Error", // 404
  userNotFoundError: "User not found", // 404
  usersInfoNotFoundError: "Users Info Not Found Error", // 404
  deletedUserInfoNotFoundError: "Deleted User Info Not Found Error", // 404
  deletedUsersInfoNotFoundError: "Deleted Users Info Not Found Error", // 404
  tarotNotFoundError: "Tarot not found", // 404
  tarotsInfoNotFoundError: "Tarots Info Not Found Error", // 404
  allUsersInfoNotFoundError: "All Users Info Not Found Error", // 404
  forbiddenError: "Forbidden Error", //403
  unauthorizedError: "unauthorized Error", // 401
  userUnauthorizedError: "User Unauthorized Error", // 401
  deletedUserUnauthorizedError: "Deleted User Unauthorized Error", // 401
  adminInfoConflictError: "Admin Info exists", // 409
  userConflictError: "User exists", // 409
  usersInfoConflictError: "Users Info exists", // 409
  deletedUserInfoConflictError: "Deleted User Info exists", // 409
  deletedUsersInfoConflictError: "Deleted Users Info exists", // 409
  tarotConflictError: "Tarot exists", // 409
  authRouterSignFailError: "authRouterSignFailError",
  FailureToSignIn: "Failure to sign in",
  refreshGoogleAccessTokenError: "refreshGoogleAccessTokenError",
  errorWhileChargingPoint: "error while charging point",

  argumentError: `Argument Error`,
  businessError: `Business Error`,
  configError: `Config Error`,
  databaseError: `DB Error`,
  fatalError: `Fatal Error`,
  objectCreationError: `Object Creation Error`,
  resourceNotFoundError: `Resource Not Found Error`,
  resourceDuplicationError: `Resource Duplication Error`,
  remoteStorageError: `Remote Storage Error`,
  requestValidationError: `Request Validation Error`,

  tokenExpiredError: "Token Expired Error",
  tokenInvalidError: "Token Invalid Error",
  tokenNotFoundError: "Token Not Found Error",
  tokenNotVerifiedError: "Token Not Verified Error",

  logInInValidError: "Log In Invalid Error",

  authRouterLogoutError: "authRouterLogoutError",

  userDAOFindByIdError: "userDAOFindByIdError",
  userDAOFindByObjIdError: "userDAOFindByObjIdError",
  userDAOFindByEmailError: "userDAOFindByEmailError",
  userDAOFindByIpAddressError: "userDAOFindByIpAddressError",
  userDAOFindByDeviceInfoError: "userDAOFindByDeviceInfoError",
  userDAOCreateError: "userDAOCreateError",
  userDAODeleteByIdError: "userDAODeleteByIdError",
  userDAOUpdateOneError: "userDAOUpdateOneError",
  userDAOCountReferralsError: "userDAOCountReferralsError",

  // === User Repository 관련 에러 추가 ===
  userRepositoryCreateError: "userRepositoryCreateError",
  userRepositoryFindByIdError: "userRepositoryFindByIdError",
  userRepositoryFindByObjIdError: "userRepositoryFindByObjIdError",
  userRepositoryFindByIpAddressError: "userRepositoryFindByIpAddressError",
  userRepositoryFindByDeviceInfoError: "userRepositoryFindByDeviceInfoError",
  userRepositoryCountReferralsError: "userRepositoryCountReferralsError",
  userRepositoryUpdateOneError: "userRepositoryUpdateOneError",
  userRepositoryDeleteByIdError: "userRepositoryDeleteByIdError",

  userServiceCreateError: "userServiceCreateError",
  userServiceGetUserByIdError: "userServiceGetUserByIdError",
  userServiceGetUserByObjIdError: "userServiceGetUserByObjIdError",
  userServiceGetUsersByRoleError: "userServiceGetUsersByRoleError",
  userServiceUpdateUserError: "userServiceUpdateUserError",
  userServiceDeleteUserError: "userServiceDeleteUserError",
  userServiceDeleteUsersError: "userServiceDeleteUsersError",
  userServiceGetAllError: "userServiceGetAllError",
  userServiceGetUsersByIpAddressError: "userServiceGetUsersByIpAddressError",
  userServiceGetUsersByDeviceInfoError: "userServiceGetUsersByDeviceInfoError",
  userServiceGetReferralCountError: "userServiceGetReferralCountError",
  userControllerDeleteUserError: "userControllerDeleteUserError",
  userControllerPutUserError: "userControllerPutUserError",
  userControllerGetUserByIdError: "userControllerGetUserByIdError",
  userControllerCreaetUserError: "userControllerCreaetUserError",

  deletedUserDAOFindByIdError: "deletedUserDAOFindByIdError",
  deletedUserDAOFindByObjIdError: "deletedUserDAOFindByObjIdError",
  deletedUserDAOFindByEmailError: "deletedUserDAOFindByEmailError",
  deletedUserDAOCreateError: "deletedUserDAOCreateError",
  deletedUserDAODeleteByIdError: "deletedUserDAODeleteByIdError",
  deletedUserDAOUpdateOneError: "deletedUserDAOUpdateOneError",
  deletedUserServiceCreateError: "deletedUserServiceCreateError",
  deletedUserServiceGetUserByIdError: "deletedUserServiceGetUserByIdError",
  deletedUserServiceGetUserByObjIdError:
    "deletedUserServiceGetUserByObjIdError",
  deletedUserServiceGetUsersByRoleError:
    "deletedUserServiceGetUsersByRoleError",
  deletedUserServiceUpdateUserError: "deletedUserServiceUpdateUserError",
  deletedUserServiceDeleteUserError: "deletedUserServiceDeleteUserError",
  deletedUserServiceDeleteUsersError: "deletedUserServiceDeleteUsersError",
  deletedUserServiceGetAllError: "deletedUserServiceGetAllError",
  deletedUserControllerDeleteUserError: "deletedUserControllerDeleteUserError",
  deletedUserControllerPutUserError: "deletedUserControllerPutUserError",
  deletedUserControllerGetUserByIdError:
    "deletedUserControllerGetUserByIdError",
  deletedUserControllerCreaetUserError: "deletedUserControllerCreaetUserError",
  deletedUserDAOFindByIdError: "deletedUserDAOFindByIdError",
  deletedUserDAOFindByObjIdError: "deletedUserDAOFindByObjIdError",
  deletedUserDAOFindByEmailError: "deletedUserDAOFindByEmailError",
  deletedUserDAOCreateError: "deletedUserDAOCreateError",
  deletedUserDAODeleteByIdError: "deletedUserDAODeleteByIdError",
  deletedUserDAOUpdateOneError: "deletedUserDAOUpdateOneError",

  // === Deleted User Repository 관련 에러 추가 ===
  deletedUserRepositoryCreateError: "deletedUserRepositoryCreateError",
  deletedUserRepositoryFindByIdError: "deletedUserRepositoryFindByIdError",
  deletedUserRepositoryFindByObjIdError:
    "deletedUserRepositoryFindByObjIdError",
  deletedUserRepositoryUpdateOneError: "deletedUserRepositoryUpdateOneError",
  deletedUserRepositoryDeleteByIdError: "deletedUserRepositoryDeleteByIdError",

  deletedUserServiceCreateError: "deletedUserServiceCreateError",
  deletedUserServiceGetUserByIdError: "deletedUserServiceGetUserByIdError",
  deletedUserServiceGetUserByObjIdError:
    "deletedUserServiceGetUserByObjIdError",
  deletedUserServiceGetUsersByRoleError:
    "deletedUserServiceGetUsersByRoleError",
  deletedUserServiceUpdateUserError: "deletedUserServiceUpdateUserError",
  deletedUserServiceDeleteUserError: "deletedUserServiceDeleteUserError",
  deletedUserServiceDeleteUsersError: "deletedUserServiceDeleteUsersError",
  deletedUserServiceGetAllError: "deletedUserServiceGetAllError",
  deletedUserControllerDeleteUserError: "deletedUserControllerDeleteUserError",
  deletedUserControllerPutUserError: "deletedUserControllerPutUserError",
  deletedUserControllerGetUserByIdError:
    "deletedUserControllerGetUserByIdError",
  deletedUserControllerCreaetUserError: "deletedUserControllerCreaetUserError",

  adminDAOCreateError: "adminDAOCreateError",
  adminDAOFindByIdError: "adminDAOFindByIdError",
  adminDAOFindByEmailError: "adminDAOFindByEmailError",
  adminDAOFindAllError: "adminDAOFindAllError",
  adminDAOFindManyByEmailError: "adminDAOFindManyByEmailError",
  adminDAOFindManyByEmailArrError: "adminDAOFindManyByEmailArrError",
  adminDAOFindManyByRoleError: "adminDAOFindManyByRoleError",
  adminDAODeleteByIdError: "adminDAODeleteByIdError",
  adminDAODeleteManyByIdError: "adminDAODeleteManyByIdError",

  // === Admin Repository 관련 에러 추가 ===
  adminRepositoryCreateError: "adminRepositoryCreateError",
  adminRepositoryFindByIdError: "adminRepositoryFindByIdError",
  adminRepositoryFindByEmailError: "adminRepositoryFindByEmailError",
  adminRepositoryFindAllError: "adminRepositoryFindAllError",
  adminRepositoryFindManyByEmailError: "adminRepositoryFindManyByEmailError",
  adminRepositoryFindManyByEmailArrError:
    "adminRepositoryFindManyByEmailArrError",
  adminRepositoryFindManyByRoleError: "adminRepositoryFindManyByRoleError",
  adminRepositoryDeleteByIdError: "adminRepositoryDeleteByIdError",
  adminRepositoryDeleteManyByIdError: "adminRepositoryDeleteManyByIdError",
  adminRepositoryUpdateOneError: "adminRepositoryUpdateOneError",
  adminRepositoryUpdateManyError: "adminRepositoryUpdateManyError",

  adminServiceCreateError: "adminServiceCreateError",
  adminServiceGetAdminByIdError: "adminServiceGetAdminByIdError",
  adminServiceGetUserByIdError: "adminServiceGetUserByIdError",
  adminServiceGetUserByEmailError: "adminServiceGetUserByEmailError",
  adminServiceGetUsersByRoleError: "adminServiceGetUsersByRoleError",
  adminServiceUpdateUserError: "adminServiceUpdateUserError",
  adminServiceUpdateAdminError: "adminServiceUpdateAdminError",
  adminServiceDeleteAdminError: "adminServiceDeleteAdminError",
  adminServiceDeleteUserError: "adminServiceDeleteUserError",
  adminServiceDeleteUsersError: "adminServiceDeleteUsersError",
  adminServiceGetAllError: "adminServiceGetAllError",
  adminControllerGetAdminByIdError: "adminControllerGetAdminByIdError",

  adminControllerGetUserByEmailError: "adminControllerGetUserByEmailError",
  adminControllerGetUserByRoleError: "adminControllerGetUserByRoleError",
  adminControllerGetUsersByRoleError: "adminControllerGetUsersByRoleError",
  adminControllerGetAllUsersError: "adminControllerGetAllUsersError",
  adminControllerPutAdminError: "adminControllerPutAdminError",
  adminControllerPutUserError: "adminControllerPutUserError",
  adminControllerDeleteAdminByIdError: "adminControllerDeleteAdminByIdError",
  adminControllerDeleteUserByEmailError:
    "adminControllerDeleteUserByEmailError",
  adminControllerDeleteUsersByEmailError:
    "adminControllerDeleteUsersByEmailError",

  tarotDAOCreateError: "tarotDAOCreateError",
  tarotDAOFindByIdError: "tarotDAOFindByIdError",
  tarotDAOFindByUserIdError: "tarotDAOFindByUserIdError",
  tarotDAOFindByAnswerError: "tarotDAOFindByAnswerError",
  tarotDAOUpdateByIdError: "tarotDAOUpdateByIdError",
  tarotDAOFindManyBySpreadError: "tarotDAOFindManyBySpreadError",
  tarotDAOFindManyByUserIdError: "tarotDAOFindManyByUserIdError",
  tarotDAOFindManyByIdError: "tarotDAOFindManyByIdError",
  tarotDAOFindManyByLanguageError: "tarotDAOFindManyByLanguageError",
  tarotDAOFindManyByOriginalTarotIdError: "tarotDAOFindManyByOriginalTarotIdError",
  tarotDAOFindAllError: "tarotDAOFindAllError",
  tarotDAOFindManyByEmailError: "tarotDAOFindManyByEmailError",
  tarotDAOFindManyByRoleError: "tarotDAOFindManyByRoleError",
  tarotDAODeleteByIdError: "tarotDAODeleteByIdError",
  tarotDAODeleteManyByIdError: "tarotDAODeleteManyByIdError",
  tarotDAODeleteManyByUserInfoError: "tarotDAODeleteManyByUserInfoError",
  tarotDAODeleteManyByUserIdAndLanguageError: "tarotDAODeleteManyByUserIdAndLanguageError",
  tarotDAODeleteManyBySpreadError: "tarotDAODeleteManyBySpreadError",
  tarotDAODeleteAllError: "tarotDAODeleteAllError",
  tarotDAODeleteByAnswerError: "tarotDAODeleteByAnswerError",
  tarotDAODeleteManyByAnswerArrError: "tarotDAODeleteManyByAnswerArrError",
  tarotDAODeleteByCreatedAtError: "tarotDAODeleteByCreatedAtError",
  tarotDAODeleteManyByCreatedAtArrError: "tarotDAODeleteManyByCreatedAtArrError",

  // === Tarot Repository 관련 에러 추가 ===
  tarotRepositoryCreateError: "tarotRepositoryCreateError",
  tarotRepositoryFindByIdError: "tarotRepositoryFindByIdError",
  tarotRepositoryFindByUserIdError: "tarotRepositoryFindByUserIdError",
  tarotRepositoryFindByAnswerError: "tarotRepositoryFindByAnswerError",
  tarotRepositoryFindManyByIdError: "tarotRepositoryFindManyByIdError",
  tarotRepositoryFindManyByLanguageError:
    "tarotRepositoryFindManyByLanguageError",
  tarotRepositoryFindManyByUserIdError: "tarotRepositoryFindManyByUserIdError",
  tarotRepositoryFindManyBySpreadError: "tarotRepositoryFindManyBySpreadError",
  tarotRepositoryDeleteByIdError: "tarotRepositoryDeleteByIdError",
  tarotRepositoryDeleteByAnswerError: "tarotRepositoryDeleteByAnswerError",
  tarotRepositoryDeleteManyByAnswerArrError:
    "tarotRepositoryDeleteManyByAnswerArrError",
  tarotRepositoryDeleteManyByIdError: "tarotRepositoryDeleteManyByIdError",
  tarotRepositoryDeleteManyByUserInfoError:
    "tarotRepositoryDeleteManyByUserInfoError",
  tarotRepositoryDeleteManyByUserIdAndLanguageError:
    "tarotRepositoryDeleteManyByUserIdAndLanguageError",
  tarotRepositoryDeleteManyBySpreadError:
    "tarotRepositoryDeleteManyBySpreadError",
  tarotRepositoryUpdateByIdError: "tarotRepositoryUpdateByIdError",
  tarotRepositoryFindManyByOriginalTarotIdError:
    "tarotRepositoryFindManyByOriginalTarotIdError",
  tarotRepositoryDeleteByCreatedAtError: "tarotRepositoryDeleteByCreatedAtError",
  tarotRepositoryDeleteManyByCreatedAtArrError:
    "tarotRepositoryDeleteManyByCreatedAtArrError",

  tarotServiceCreateTarotError: "tarotServiceCreateTarotError",
  tarotServiceGetByIdError: "tarotServiceGetByIdError",
  tarotServiceGetManyBySpreadError: "tarotServiceGetManyBySpreadError",
  tarotServiceGetManyByUserInfoError: "tarotServiceGetManyByUserInfoError",
  tarotServiceGetManyByLanguageError: "tarotServiceGetManyByLanguageError",
  tarotServiceGetAllError: "tarotServiceGetAllError",
  tarotServiceGetTarotByIdError: "tarotServiceGetTarotByIdError",
  tarotServiceUpdateTarotByIdError: "tarotServiceUpdateTarotByIdError",
  tarotServiceGetTarotsByIdError: "tarotServiceGetTarotsByIdError",
  tarotServiceGetTarotsByUserError: "tarotServiceGetTarotsByUserError",
  tarotServiceGetHistoryByUserIdError: "tarotServiceGetHistoryByUserIdError",
  tarotServiceGetTarotsBySpreadError: "tarotServiceGetTarotsBySpreadError",
  tarotServiceGetAdditionalQuestionsByOriginalTarotIdError: "tarotServiceGetAdditionalQuestionsByOriginalTarotIdError",
  tarotServiceDeleteTarotByIdError: "tarotServiceDeleteTarotByIdError",
  tarotServiceDeleteTarotByAnswerError: "tarotServiceDeleteTarotByAnswerError",
  tarotServiceDeleteByIdError: "tarotServiceDeleteByIdError",
  tarotServiceDeleteManyByIdError: "tarotServiceDeleteManyByIdError",
  tarotServiceDeleteTarotsByUserIdError:
    "tarotServiceDeleteTarotsByUserIdError",
  tarotServiceDeleteTarotsByUserObjIdError:
    "tarotServiceDeleteTarotsByUserObjIdError",
  tarotServiceDeleteTarotsByUserObjIdAndLanguageError:
    "tarotServiceDeleteTarotsByUserObjIdAndLanguageError",
  tarotServiceDeleteTarotsBySpreadError:
    "tarotServiceDeleteTarotsBySpreadError",
  tarotServiceDeleteAllError: "tarotServiceDeleteAllError",
  tarotServiceDeleteTarotByCreatedAtError:
    "tarotServiceDeleteTarotByCreatedAtError",
  tarotServiceDeleteTarotsByCreatedAtArrError:
    "tarotServiceDeleteTarotsByCreatedAtArrError",
  tarotControllerPostQuestionError: "tarotControllerPostQuestionError",
  tarotControllerGetHistoryError: "tarotControllerGetHistoryError",
  tarotControllerDeleteHistoryError: "tarotControllerDeleteHistoryError",

  // === Violation 관련 에러 추가 ===
  violationDAOCreateError: "violationDAOCreateError",
  violationDAOFindByObjIdError: "violationDAOFindByObjIdError",
  violationDAOFindByObjIdArrError: "violationDAOFindByObjIdArrError",
  violationDAOFindManyByUserObjIdError: "violationDAOFindManyByUserObjIdError",
  violationDAOFindByOrderIdError: "violationDAOFindByOrderIdError",
  violationDAODeleteByObjIdError: "violationDAODeleteByObjIdError",
  violationDAODeleteManyByUserObjIdError:
    "violationDAODeleteManyByUserObjIdError",
  violationDAODeleteAllError: "violationDAODeleteAllError",
  violationDAOUpdateByObjIdError: "violationDAOUpdateByObjIdError",
  violationDAOUpdateByUserObjIdError: "violationDAOUpdateByUserObjIdError",

  violationRepositoryCreateError: "violationRepositoryCreateError",
  violationRepositoryFindByObjIdError: "violationRepositoryFindByObjIdError",
  violationRepositoryFindByObjIdArrError: "violationRepositoryFindByObjIdArrError",
  violationRepositoryFindManyByUserObjIdError:
    "violationRepositoryFindManyByUserObjIdError",
  violationRepositoryFindByOrderIdError: "violationRepositoryFindByOrderIdError",
  violationRepositoryDeleteByObjIdError: "violationRepositoryDeleteByObjIdError",
  violationRepositoryDeleteManyByUserObjIdError:
    "violationRepositoryDeleteManyByUserObjIdError",
  violationRepositoryDeleteAllError: "violationRepositoryDeleteAllError",
  violationRepositoryUpdateByObjIdError: "violationRepositoryUpdateByObjIdError",
  violationRepositoryUpdateByUserObjIdError:
    "violationRepositoryUpdateByUserObjIdError",

  violationServiceCreateViolation: "violationServiceCreateViolation",
  violationServiceGetViolationByObjIdError:
    "violationServiceGetViolationByObjIdError",
  violationServiceGetViolationByOrderIdError:
    "violationServiceGetViolationByOrderIdError",
  violationServiceGetViolationsByUserObjIdError:
    "violationServiceGetViolationsByUserObjIdError",
  violationServiceDeleteViolationByObjIdError:
    "violationServiceDeleteViolationByObjIdError",
  violationServiceDeleteViolationByOrderIdError:
    "violationServiceDeleteViolationByOrderIdError",
  violationServiceDeleteViolationsByUserObjIdError:
    "violationServiceDeleteViolationsByUserObjIdError",
  violationServiceDeleteViolationsByObjIdArrError:
    "violationServiceDeleteViolationsByObjIdArrError",
  violationServicePutViolationByOrderIdError:
    "violationServicePutViolationByOrderIdError",
  violationServicePutViolationByUserObjIdError:
    "violationServicePutViolationByUserObjIdError",

  violationNotFoundError: "Violation not found", // 404
  violationsInfoNotFoundError: "Violations Info Not Found Error", // 404
  violationPreInfoConflictError: "Violation Info already exists", // 409

  chargeDAOCreateError: "chargeDAOCreateError",
  chargeDAOFindByObjIdError: "chargeDAOFindByObjIdError",
  chargeDAOFindByObjIdArrError: "chargeDAOFindByObjIdArrError",
  chargeDAOFindByOrderIdError: "chargeDAOFindByOrderIdError",
  chargeDAOFindByUserObjIdError: "chargeDAOFindByUserObjIdError",
  chargeDAOFindManyByUserObjIdError: "chargeDAOFindManyByUserObjIdError",
  chargeDAOFindManyByCurrencyError: ".chargeDAOFindManyByCurrencyError",
  chargeDAODeleteByObjIdError: "chargeDAODeleteByObjIdError",
  chargeDAODeleteByOrderIdError: "chargeDAODeleteByOrderIdError",
  chargeDAODeleteManyByUserObjIdError: "chargeDAODeleteManyByUserObjIdError",
  chargeDAODeleteManyByUserObjIdAndPaymentKeyError:
    "chargeDAODeleteManyByUserObjIdAndPaymentKeyError",
  chargeDAODeleteManyByObjIdError: "chargeDAODeleteManyByObjIdError",
  chargeDAODeleteAllError: "chargeDAODeleteAllError",
  chargeDAOUpdateByObjIdError: "chargeDAOUpdateByObjIdError",
  chargeDAOUpdateByUserObjIdError: "chargeDAOUpdateByUserObjIdError",

  // === Charge Repository 관련 에러 추가 ===
  chargeRepositoryCreateError: "chargeRepositoryCreateError",
  chargeRepositoryFindByObjIdError: "chargeRepositoryFindByObjIdError",
  chargeRepositoryFindByObjIdArrError: "chargeRepositoryFindByObjIdArrError",
  chargeRepositoryFindByOrderIdError: "chargeRepositoryFindByOrderIdError",
  chargeRepositoryFindByUserObjIdError: "chargeRepositoryFindByUserObjIdError",
  chargeRepositoryFindManyByUserObjIdError:
    "chargeRepositoryFindManyByUserObjIdError",
  chargeRepositoryFindManyByProductIdError:
    "chargeRepositoryFindManyByProductIdError",
  chargeRepositoryFindManyByCurrencyError:
    "chargeRepositoryFindManyByCurrencyError",
  chargeRepositoryDeleteByObjIdError: "chargeRepositoryDeleteByObjIdError",
  chargeRepositoryDeleteByOrderIdError: "chargeRepositoryDeleteByOrderIdError",
  chargeRepositoryDeleteManyByObjIdError:
    "chargeRepositoryDeleteManyByObjIdError",
  chargeRepositoryDeleteManyByUserObjIdAndPaymentKeyError:
    "chargeRepositoryDeleteManyByUserObjIdAndPaymentKeyError",
  chargeRepositoryUpdateByObjIdError: "chargeRepositoryUpdateByObjIdError",

  chargeDAOFindManyByProductIdError: "chargeDAOFindManyByProductIdError",
  chargeServiceCreateChargeForTossPrePayment:
    "chargeServiceCreateChargeForTossPrePayment",
  chargeServiceCreateChargeForAndroidGooglePlay:
    "chargeServiceCreateChargeForAndroidGooglePlay",
  chargeServiceGetChargesByProductIdError:
    "chargeServiceGetChargesByProductIdError",
  chargeServiceGetChargeByOrderIdError: "chargeServiceGetChargeByOrderIdError",
  chargeServiceGetChargeByObjIdError: "chargeServiceGetChargeByObjIdError",
  chargeServiceGetChargeByUserObjIdError:
    "chargeServiceGetChargeByUserObjIdError",
  chargeServiceGetChargesByUserObjIdError:
    "chargeServiceGetChargesByUserObjIdError",
  chargeServiceGetChargesByCurrencyError:
    "chargeServiceGetChargesByCurrencyError",
  chargeServiceDeleteChargeByOrderIdError:
    "chargeServiceDeleteChargeByOrderIdError",
  chargeServiceDeleteChargeByObjIdError:
    "chargeServiceDeleteChargeByObjIdError",
  chargeServiceDeleteChargesByObjIdArrError:
    "chargeServiceDeleteChargesByObjIdArrError",
  chargeServiceDeleteChargesByUserObjIdError:
    "chargeServiceDeleteChargesByUserObjIdError",
  chargeServiceDeleteChargesByUserObjIdAndPaymentKeyError:
    "chargeServiceDeleteChargesByUserObjIdAndPaymentKeyError",
  chargeServicePutChargeByOrderIdError: "chargeServicePutChargeByOrderIdError",
  chargeServicePutChargeByObjIdError: "chargeServicePutChargeByObjIdError",

  chargeControllerGetPrePaymentForTossError:
    "chargeControllerGetPrePaymentForTossError",
  chargeControllerPostChargeError: "chargeControllerPostChargeError",
  chargeControllerPostChargeForGooglePayError:
    "chargeControllerPostChargeForGooglePayError",
  chargeControllerPostPrePaymentForTossError:
    "chargeControllerPostPrePaymentForTossError",
  chargeControllerDeletePrePaymentForTossByOrderIdError:
    "chargeControllerDeletePrePaymentForTossByOrderIdError",
  chargeControllerDeletePrePaymentForTossByPaymentKeyError:
    "chargeControllerDeletePrePaymentForTossByPaymentKeyError",
  chargeControllerPutPrePaymentForTossError:
    "chargeControllerPutPrePaymentForTossError",

  chargePreInfoConflictError: "chargePreInfoConflictError",
  chargeNotFoundError: "Charge not found",
  chargesInfoNotFoundError: "chargesInfoNotFoundError",
};

module.exports = commonErrors;
