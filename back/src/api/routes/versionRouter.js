const versionRouter = require("express").Router();

/**
 * 버전 체크 API
 * GET /version/check
 *
 * 앱의 버전 정보를 반환합니다.
 * - minimumVersion: 앱이 정상 작동하기 위한 최소 지원 버전 (이보다 낮으면 강제 업데이트)
 * - updateUrl: 각 플랫폼별 앱스토어 URL
 */
versionRouter.get("/check", (req, res) => {
  try {
    // 환경변수에서 버전 정보 가져오기 (없으면 기본값 사용)
    const versionInfo = {
      minimumVersion: process.env.APP_MINIMUM_VERSION,
      updateUrl: {
        ios:
          process.env.APP_IOS_URL,
        android:
          process.env.APP_ANDROID_URL,
      },
    };

    // 로깅 (모니터링용)
    console.log(
      `[버전 체크 API] 요청 - IP: ${req.ip}, UserAgent: ${req.get(
        "user-agent"
      )}`
    );

    res.status(200).json(versionInfo);
  } catch (error) {
    console.error("[Version API] Error:", error);
    res.status(500).json({
      error: "버전 정보를 가져올 수 없습니다.",
      message: error.message,
    });
  }
});

module.exports = versionRouter;
