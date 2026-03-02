const { userService } = require("../../domains/user/services");

const getGoogleToken = {
  getGoogleAccessToken: async (userId) => {
    try {
      const user = await userService.getUserById(userId);
      // db내 accessToken : 일단 구글 oauth 토큰으로 사용하고 있음.
      const accessToken = user.accessToken;
      return accessToken;
    } catch (err) {
      throw err;
    }
  },
  getGoogleRefreshToken: async (userId) => {
    try {
      const user = await userService.getUserById(userId);
      // db내 refreshToken : 일단 구글 oauth 토큰으로 사용하고 있음.
      const refreshToken = user.refreshToken;
      return refreshToken;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = getGoogleToken;
