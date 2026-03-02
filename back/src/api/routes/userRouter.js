const userRouter = require("express").Router();
const { userController } = require("../../domains/user/controllers/index");
const checkTokenWithRefresh = require("../middlewares/checkTokenWithRefresh");

userRouter.get(
  "/profile",
  checkTokenWithRefresh,
  userController.getUserById
);
userRouter.put(
  "/profile",
  checkTokenWithRefresh,
  userController.putUser
);
userRouter.delete(
  "/account",
  checkTokenWithRefresh,
  userController.deleteUser
);

module.exports = userRouter;
