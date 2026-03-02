const { body, param, query, validationResult } = require("express-validator");
const AppError = require("../../common/errors/AppError");

// 입력 데이터 검증 미들웨어
// express-validator를 사용한 요청 데이터 검증

// 검증 결과 처리 미들웨어
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return next(
      new AppError(
        "validation_error",
        "Input data is invalid.",
        400,
        errorMessages
      )
    );
  }

  next();
};

// 사용자 관련 검증 규칙
// 사용자 회원가입 검증
const validateUserRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("displayName")
    .isLength({ min: 1, max: 50 })
    .withMessage("Display name must be between 1 and 50 characters.")
    .trim(),

  handleValidationErrors,
];

// 사용자 정보 수정 검증
const validateUserUpdate = [
  body("displayName")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Display name must be between 1 and 50 characters.")
    .trim(),

  handleValidationErrors,
];

// 타로 관련 검증 규칙
// 타로 리딩 검증
const validateTarotReading = [
  body("cards")
    .isArray({ min: 1, max: 15 })
    .withMessage("Cards must be between 1 and 15."),

  handleValidationErrors,
];

// 타로 히스토리 검증
const validateTarotHistory = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page must be between 1 and 100."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50."),

  handleValidationErrors,
];

// 결제 관련 검증 규칙
// 결제 검증
const validatePayment = [
  body("orderId")
    .isLength({ min: 5, max: 70 })
    .withMessage("Order ID must be between 5 and 70 characters."),

  handleValidationErrors,
];

// 페이지네이션 검증
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Page must be between 1 and 1000."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "amount", "status"])
    .withMessage("Please select a valid sort field."),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'."),

  handleValidationErrors,
];

// 공통 검증 함수들
// 이메일 검증
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 검증
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

// 한국어 이름 검증
const validateKoreanName = (name) => {
  const koreanRegex = /^[가-힣]{2,10}$/;
  return koreanRegex.test(name);
};

// 비밀번호 검증
const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 커스텀 검증자들
const customValidators = {
  // 한국 휴대폰 번호 검증
  isKoreanPhone: (value) => {
    if (!value) return true;
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(value);
  },

  // 미래 날짜 검증
  isFutureDate: (value) => {
    if (!value) return true;
    return new Date(value) > new Date();
  },

  // 과거 날짜 검증
  isPastDate: (value) => {
    if (!value) return true;
    return new Date(value) < new Date();
  },
};

module.exports = {
  validateUserRegistration,
  validateUserUpdate,
  validateTarotReading,
  validateTarotHistory,
  validatePayment,
  validatePagination,
  validateEmail,
  validatePhoneNumber,
  validateKoreanName,
  validatePassword,
  customValidators,
  handleValidationErrors,
};
