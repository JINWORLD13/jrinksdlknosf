import { useTranslation } from 'react-i18next';
import styles from './UserVoucherInfo.module.scss';
import { useLanguageChange } from '@/hooks';
import { getPathWithLang } from '@/config/route/UrlPaths';
import Button from '../../../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { isDevelopmentMode } from '@/utils/constants';

const isNative = Capacitor.isNativePlatform();
import { StarIcon } from '../../../modals/PurchaseModal/InAppPurchase/components/StarIcon.jsx';

export const UserVoucherInfo = ({
  userInfo,
  updateUserAlertModalOpen,
  updateChargeModalOpen,
  isInAppPurchaseOpen,
  setInAppPurchaseOpen,
  resultOfHasUserEmail,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLandscape, setIsLandscape] = useState(
    window.screen.width > window.screen.height
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.screen.width > window.screen.height);
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);
  const openAlertModal = () => {
    updateUserAlertModalOpen(true);
  };
  const openChargeModal = () => {
    updateChargeModalOpen(true);
  };
  const browserLanguage = useLanguageChange();
  const [userInfo2, setUserInfo2] = useState({
    vouchers: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      13: 0,
    },
    stars: 0,
  });
  useEffect(() => {
    if (userInfo?.displayName !== undefined && userInfo2.displayName !== null) {
      // 만료된 쿠폰 처리 로직
      const processExpiredVouchers = userInfo => {
        const currentDate = new Date();
        const updatedUserInfo = { ...userInfo };
        const updatedVoucherInDetail = { ...userInfo.vouchersInDetail };
        const updatedVouchers = { ...userInfo.vouchers };

        // vouchersInDetail의 각 타입을 순회
        Object.keys(updatedVoucherInDetail).forEach(voucherType => {
          const voucherTypeNum = parseInt(voucherType);
          const vouchersArr = updatedVoucherInDetail[voucherType] || [];
          let expiredCount = 0;

          // 만료되지 않은 쿠폰만 필터링
          const validVouchers = vouchersArr?.filter(voucher => {
            try {
              const expireDate = voucher[10];

              // 만료일이 있는 경우에만 확인
              if (
                expireDate &&
                expireDate !== null &&
                expireDate !== undefined &&
                expireDate !== 'NA' &&
                expireDate.toString().trim() !== ''
              ) {
                const expireDateObj = new Date(expireDate);

                // 유효한 날짜인지 확인
                if (!isNaN(expireDateObj.getTime())) {
                  // 현재 날짜보다 작으면 만료된 쿠폰
                  if (expireDateObj < currentDate) {
                    if (isDevelopmentMode) {
                      console.log(
                        `Expired voucher found: ${expireDate} < ${currentDate.toISOString()}`
                      );
                    }
                    expiredCount++;
                    return false; // 제거
                  }
                }
              }
              return true; // 유지
            } catch (error) {
              console.error('Error processing voucher expiration:', error);
              return true; // 에러 시 유지
            }
          });

          // 만료된 쿠폰이 있으면 업데이트
          if (expiredCount > 0) {
            if (isDevelopmentMode) {
              console.log(
                `Found ${expiredCount} expired vouchers in type ${voucherType}`
              );
            }

            // vouchersInDetail 업데이트 (만료된 쿠폰 제거)
            updatedVoucherInDetail[voucherType] = validVouchers;

            // vouchers 개수 차감 (음수 방지)
            updatedVouchers[voucherTypeNum] = Math.max(
              0,
              (updatedVouchers[voucherTypeNum] || 0) - expiredCount
            );
          }
        });

        // 만료된 쿠폰이 있었다면 업데이트된 userInfo 반환
        const hasExpiredVouchers = Object.keys(updatedVoucherInDetail).some(
          type =>
            (updatedVoucherInDetail[type]?.length || 0) !==
            (userInfo.vouchersInDetail?.[type]?.length || 0)
        );

        if (hasExpiredVouchers) {
          if (isDevelopmentMode) {
            console.log('Expired vouchers processed, updating user info');
          }
          return {
            ...updatedUserInfo,
            vouchersInDetail: updatedVoucherInDetail,
            vouchers: updatedVouchers,
          };
        }

        return userInfo;
      };

      const processedUserInfo = processExpiredVouchers(userInfo);
      setUserInfo2({ ...processedUserInfo });
    }
  }, [userInfo, browserLanguage]);

  return (
    <>
      <h2
        className={`${
          browserLanguage === 'ja' ? styles['h2-japanese'] : styles['h2']
        } ${
          browserLanguage === 'ja'
            ? styles['japanese-potta-font']
            : styles['korean-dongle-font']
        }`}
      >
        {t(`mypage.user-voucher-info`)}
      </h2>
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['user-info1-bottom-japanese']
            : styles['user-info1-bottom']
        }`}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        {/* 아래는, 가로모드에서 스크롤을 내린후 세로모드로 바꾸어도 내린 높이만큼 컨텐츠가 밀려 올라가는 오류가 나지 않게 하기 위함. */}
        {isLandscape && !isNative && (
          <>
            <Button
              onClick={() => {
                openChargeModal();
              }}
            >
              {t(`button.purchase`)}
            </Button>
            <Button
              onClick={() => {
                // 라우트 설정시, 어느 라우트의 children으로 넣지 말고 첫 app 컴포넌트(혹은 home)의 라우트의 children 기준으로 만들기.
                if (!resultOfHasUserEmail) return;
                navigate(getPathWithLang(browserLanguage).P20, {
                  state: { userInfo: userInfo },
                });
              }}
            >
              {t(`button.refund`)}
            </Button>
          </>
        )}
        {!isLandscape && !isNative && (
          <>
            <Button
              onClick={() => {
                openChargeModal();
              }}
            >
              {t(`button.purchase`)}
            </Button>
            <Button
              onClick={() => {
                if (!resultOfHasUserEmail) return;
                navigate(getPathWithLang(browserLanguage).P20, {
                  state: { userInfo: userInfo },
                });
              }}
            >
              {t(`button.refund`)}
            </Button>
          </>
        )}
        {isLandscape && isNative && (
          <>
            <Button onClick={() => setInAppPurchaseOpen(true)}>
              {t(`button.purchase`)}
            </Button>
          </>
        )}
        {!isLandscape && isNative && (
          <>
            <Button onClick={() => setInAppPurchaseOpen(true)}>
              {t(`button.purchase`)}
            </Button>
          </>
        )}
      </div>
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['user-info1-body-japanese']
            : styles['user-info1-body']
        } ${
          browserLanguage === 'ja'
            ? styles['japanese-potta-font2']
            : styles['korean-dongle-font2']
        }`}
      >
        <div>
          <div className={styles['flex-grow2']}></div>
          <div
            className={`${
              browserLanguage === 'ja'
                ? styles['user-info1-body-left-japanese']
                : styles['user-info1-body-left']
            } ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <span>{t(`mypage.voucher-1`)}</span>
            <span>{t(`mypage.voucher-2`)}</span>
            <span>{t(`mypage.voucher-3`)}</span>
            <span>{t(`mypage.voucher-4`)}</span>
            <span>{t(`mypage.voucher-5`)}</span>
            <span>{t(`mypage.voucher-6`)}</span>
          </div>
          <div
            className={`${
              browserLanguage === 'ja'
                ? styles['user-info1-body-right-japanese']
                : styles['user-info1-body-right']
            } ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <div>
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['one-card']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    I x{' '}
                  </span>
                  <span
                    className={`${styles['one-card-japanese']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['1'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['one-card']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    I x{' '}
                  </span>
                  <span
                    className={`${styles['one-card-japanese']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['1'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['two-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    II x{' '}
                  </span>
                  <span
                    className={`${styles['two-cards-japanese']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['2'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['two-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    II x{' '}
                  </span>
                  <span
                    className={`${styles['two-cards-japanese']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['2'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['three-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    III x{' '}
                  </span>
                  <span
                    className={`${styles['three-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['3'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['three-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    III x{' '}
                  </span>
                  <span
                    className={`${styles['three-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['3'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['four-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    IV x{' '}
                  </span>
                  <span
                    className={`${styles['four-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['4'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['four-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    IV x{' '}
                  </span>
                  <span
                    className={`${styles['four-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['4'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['five-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    V x{' '}
                  </span>
                  <span
                    className={`${styles['five-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['5'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['five-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    V x{' '}
                  </span>
                  <span
                    className={`${styles['five-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['5'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
              {browserLanguage === 'ja' ? (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['six-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    VI x{' '}
                  </span>
                  <span
                    className={`${styles['six-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['6'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              ) : (
                <div
                  className={`${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {': '}
                  {'\n'}
                  <span
                    className={`${styles['six-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    VI x{' '}
                  </span>
                  <span
                    className={`${styles['six-cards']} ${
                      browserLanguage === 'ja'
                        ? styles['japanese-potta-font2']
                        : styles['korean-dongle-font2']
                    }`}
                  >
                    {userInfo2?.vouchers['6'] ?? 0}
                    {t(`unit.ea`)}
                  </span>{' '}
                </div>
              )}
            </div>
          </div>
          <div className={styles['flex-grow2']}></div>
          <div
            className={`${
              browserLanguage === 'ja'
                ? styles['user-info1-body-left-japanese']
                : styles['user-info1-body-left']
            } ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <span>{t(`mypage.voucher-7`)}</span>
            <span>{t(`mypage.voucher-8`)}</span>
            <span>{t(`mypage.voucher-9`)}</span>
            <span>{t(`mypage.voucher-10`)}</span>
            <span>{t(`mypage.voucher-11`)}</span>
            <span>{t(`mypage.voucher-13`)}</span>
          </div>
          <div>
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['seven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  VII x{' '}
                </span>
                <span
                  className={`${styles['seven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['7'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['seven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  VII x{' '}
                </span>
                <span
                  className={`${styles['seven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['7'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['eight-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  VIII x{' '}
                </span>
                <span
                  className={`${styles['eight-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['8'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['eight-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  VIII x{' '}
                </span>
                <span
                  className={`${styles['eight-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['8'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['nine-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  IX x{' '}
                </span>
                <span
                  className={`${styles['nine-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['9'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['nine-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  IX x{' '}
                </span>
                <span
                  className={`${styles['nine-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['9'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['ten-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  X x{' '}
                </span>
                <span
                  className={`${styles['ten-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['10'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['ten-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  X x{' '}
                </span>
                <span
                  className={`${styles['ten-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['10'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['eleven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  XI x{' '}
                </span>
                <span
                  className={`${styles['eleven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['11'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['eleven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  XI x{' '}
                </span>
                <span
                  className={`${styles['eleven-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['11'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
            {browserLanguage === 'ja' ? (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['thirteen-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  XIII x{' '}
                </span>
                <span
                  className={`${styles['thirteen-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['13'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            ) : (
              <div
                className={`${
                  browserLanguage === 'ja'
                    ? styles['japanese-potta-font2']
                    : styles['korean-dongle-font2']
                }`}
              >
                {': '}
                {'\n'}
                <span
                  className={`${styles['thirteen-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  XIII x{' '}
                </span>
                <span
                  className={`${styles['thirteen-cards']} ${
                    browserLanguage === 'ja'
                      ? styles['japanese-potta-font2']
                      : styles['korean-dongle-font2']
                  }`}
                >
                  {userInfo2?.vouchers['13'] ?? 0}
                  {t(`unit.ea`)}
                </span>{' '}
              </div>
            )}
          </div>
          <div className={styles['flex-grow2']}></div>
        </div>
      </div>

      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['user-info1-body-japanese']
            : styles['user-info1-body']
        } ${
          browserLanguage === 'ja'
            ? styles['japanese-potta-font2']
            : styles['korean-dongle-font2']
        }`}
        style={{ marginTop: '5px' }}
      >
        <div style={{ justifyContent: 'center' }}>
          <span>{t(`product.star_currency`)} : </span>
          {'\u00A0'}
          <span
            className={`${styles['one-card']} ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <StarIcon
              width="24"
              height="24"
              style={{
                display: 'inline-block',
                verticalAlign: 'sub',
                color: '#FFD700',
                marginRight: '2px',
              }}
            />{' '}
          </span>
          <span
            className={`${styles['one-card-japanese']} ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            x {userInfo2?.stars ?? 0}
            {t(`unit.ea`)}
          </span>
        </div>
      </div>
    </>
  );
};
