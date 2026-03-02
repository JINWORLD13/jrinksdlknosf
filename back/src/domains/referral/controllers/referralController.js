const mongoose = require("mongoose");
const AppError = require("../../../common/errors/AppError");
const userService = require("../../user/services/userService");
const { parseLanguage } = require("../../../common/utils/languageUtils");
const cacheClient = require("../../../cache/cacheClient");

// 피초대자(invitee) 리워드 설정: voucherType -> 수량
// 被招待者(invitee)リワード設定: voucherType -> 数量
// Configurable invitee reward set: voucherType -> amount
const REFERRAL_REWARD = {
  2: 1,
  3: 1,
  10: 1,
};
// 추천인(referrer) 리워드 설정: 2장권, 3장권, 10장권 각각 2장씩 지급
// 推薦者(referrer)リワード設定: 2枚券, 3枚券, 10枚券 各2枚ずつ支給
// Configurable referrer reward set: 2, 3, 10 vouchers × 2 each
const REFERRER_REWARD = {
  2: 2,
  3: 2,
  10: 2,
};

// 언어별 제한 초과 메시지 반환
// 言語別制限超過メッセージを返す
// Returns limit-exceeded message per language
const getLimitExceededMessage = (limitType, limit, language) => {
  const messages = {
    ko: {
      IP: `같은 네트워크에서 해당 추천인에게 초대 리워드를 받은 인원이 이미 최대치(${limit}명)에 도달했습니다.`,
      device: `같은 기기에서 해당 추천인에게 초대 리워드를 받은 인원이 이미 최대치(${limit}명)에 도달했습니다.`,
    },
    en: {
      IP: `The maximum number of people (${limit}) who have received referral rewards from this referrer on the same network has been reached.`,
      device: `The maximum number of people (${limit}) who have received referral rewards from this referrer on the same device has been reached.`,
    },
    ja: {
      IP: `同じネットワークでこの推薦者から招待リワードを受けた人数が既に上限（${limit}人）に達しています。`,
      device: `同じデバイスでこの推薦者から招待リワードを受けた人数が既に上限（${limit}人）に達しています。`,
    },
  };

  return messages[language]?.[limitType] || messages.en[limitType];
};

const referralController = {
  async claimReferral(req, res, next) {
    try {
      const inviteeUserId = req.user; // checkTokenWithRefresh에서 설정 / checkTokenWithRefreshで設定 / set by checkTokenWithRefresh
      const referrerId = req?.body?.referrerId;

      if (!referrerId || typeof referrerId !== "string") {
        return next(new AppError("bad request", "referrerId is required", 400));
      }
      if (referrerId === inviteeUserId) {
        // 자기 추천은 정상 처리 (200 반환)
        // 自己推薦は正常処理として200返却
        // Self-referral treated as success, return 200
        return res.status(200).json({ success: true, selfReferral: true });
      }

      const [invitee, referrer] = await Promise.all([
        userService.getUserById(inviteeUserId),
        userService.getUserById(referrerId),
      ]);

      if (!invitee)
        return next(new AppError("not found", "invitee not found", 404));
      if (!referrer)
        return next(new AppError("not found", "referrer not found", 404));

      if (invitee?.referralRewardClaimed || invitee?.referredBy) {
        return res.status(200).json({ success: true, alreadyClaimed: true });
      }

      // 전체 누적 제한 제거: IP/디바이스 기준 제한만 적용
      // 全体累積制限を解除: IP/デバイス基準の制限のみ適用
      // No global cumulative limit: only IP/device-based limits apply

      // IP 기반 검증: 피추천인 IP에서 해당 추천인으로 이미 리워드를 받은 인원 수 확인
      // IPベース検証: 被招待者IPで当該推薦者から既にリワードを受けた人数を確認
      // IP-based validation: count users from same IP who already received reward from this referrer
      if (invitee?.ipAdd && invitee.ipAdd.trim() !== "") {
        const usersFromSameIp = await userService.getUsersByIpAddress(
          invitee.ipAdd
        );
        const referralCountFromSameIp = usersFromSameIp.filter(
          (user) => user.referredBy === referrerId
        ).length;

        if (referralCountFromSameIp >= 4) {
          const language = parseLanguage(req);
          return res.status(400).json({
            success: false,
            limitExceeded: true,
            limitType: "IP",
            message: getLimitExceededMessage("IP", 4, language),
          });
        }
      }

      // 기기 기반 검증: 피추천인 기기에서 해당 추천인으로 이미 리워드를 받은 인원 수 확인
      // デバイスベース検証: 被招待者デバイスで当該推薦者から既にリワードを受けた人数を確認
      // Device-based validation: count users from same device who already received reward from this referrer
      if (
        invitee?.userAgent?.deviceType &&
        invitee?.userAgent?.os &&
        invitee?.userAgent?.browser
      ) {
        const usersFromSameDevice = await userService.getUsersByDeviceInfo({
          deviceType: invitee.userAgent.deviceType,
          os: invitee.userAgent.os,
          browser: invitee.userAgent.browser,
        });
        const referralCountFromSameDevice = usersFromSameDevice.filter(
          (user) => user.referredBy === referrerId
        ).length;

        if (referralCountFromSameDevice >= 4) {
          const language = parseLanguage(req);
          return res.status(400).json({
            success: false,
            limitExceeded: true,
            limitType: "device",
            message: getLimitExceededMessage("device", 4, language),
          });
        }
      }

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          // 피초대자 업데이트용 바우처 생성
          // 被招待者用更新バウチャーを作成
          // Build updated vouchers for invitee
          const updatedInviteeVouchers = { ...(invitee?.vouchers || {}) };
          Object.entries(REFERRAL_REWARD).forEach(([type, amount]) => {
            const key = Number(type);
            const current = Number(updatedInviteeVouchers[key] || 0);
            updatedInviteeVouchers[key] = current + Number(amount);
          });

          // 추천인 업데이트용 바우처 생성
          // 推薦者用更新バウチャーを作成
          // Build updated vouchers for referrer
          const updatedReferrerVouchers = { ...(referrer?.vouchers || {}) };
          Object.entries(REFERRER_REWARD).forEach(([type, amount]) => {
            const key = Number(type);
            const current = Number(updatedReferrerVouchers[key] || 0);
            updatedReferrerVouchers[key] = current + Number(amount);
          });

          // 피초대자·추천인 업데이트를 원자적으로 저장
          // 被招待者·推薦者更新をアトミックに保存
          // Persist both invitee and referrer updates atomically
          await Promise.all([
            userService.updateUser(
              {
                ...invitee,
                vouchers: updatedInviteeVouchers,
                referredBy: referrerId,
                referralRewardClaimed: true,
                referralClaimedAt: new Date(),
              },
              session
            ),
            userService.updateUser(
              {
                ...referrer,
                vouchers: updatedReferrerVouchers,
                referralCount: (referrer.referralCount || 0) + 1,
              },
              session
            ),
          ]);
        });
      } finally {
        await session.endSession();
      }

      // 리워드 지급 성공 후 Redis 캐시 무효화 (프론트엔드 갱신용)
      // リワード支給成功後Redisキャッシュを無効化（フロント更新のため）
      // Invalidate Redis cache after successful reward grant (for frontend refresh)
      await Promise.all([
        cacheClient.del(`user:${inviteeUserId}`),
        cacheClient.del(`user:${referrerId}`),
      ]);

      return res.status(200).json({
        success: true,
        inviteeRewarded: REFERRAL_REWARD,
        referrerRewarded: REFERRER_REWARD,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = referralController;
