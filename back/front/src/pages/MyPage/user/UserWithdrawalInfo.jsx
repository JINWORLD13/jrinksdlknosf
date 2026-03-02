import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserWithdrawalInfo.module.scss';
import { useLanguageChange } from '@/hooks';
import Button from '../../../components/common/Button.jsx';
import { useEffect, useState } from 'react';

export const UserWithdrawalInfo = ({
  userInfo,
  updateUserAlertModalOpen,
  updateChargeModalOpen,
  ...props
}) => {
  const { t } = useTranslation();
  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window !== 'undefined')
      window.screen.width > window.screen.height;
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      if (typeof window !== 'undefined')
        setIsLandscape(() => {
          if (typeof window !== 'undefined')
            window.screen.width > window.screen.height;
        });
    };

    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleOrientationChange);

    return () => {
      if (typeof window !== 'undefined')
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
  });
  //& userInfo가 3번에 걸쳐서야 데이터가 들어오므로 이걸로 함.
  useEffect(() => {
    if (userInfo?.displayName !== undefined && userInfo2.displayName !== null) {
      setUserInfo2({ ...userInfo });
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
        {t(`mypage.user-info-withdraw`)}
      </h2>
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
        {/* 아래는, 가로모드에서 스크롤을 내린후 세로모드로 바꾸어도 내린 높이만큼 컨텐츠가 밀려 올라가는 오류가 나지 않게 하기 위함. */}
        {isLandscape && (
          <>
            <div
              className={`${
                browserLanguage === 'ja'
                  ? styles['withdraw-warning-japanese']
                  : styles['withdraw-warning']
              }`}
            >
              {t(`alert_modal.withdraw_warning`)}
            </div>
            <Button
              onClick={() => {
                openAlertModal();
                // deleteUserInfo();
              }}
            >
              {t(`button.withdraw`)}
            </Button>
          </>
        )}
        {!isLandscape && (
          <>
            <div
              className={`${
                browserLanguage === 'ja'
                  ? styles['withdraw-warning-japanese']
                  : styles['withdraw-warning']
              }`}
            >
              {t(`alert_modal.withdraw_warning`)}
            </div>
            <Button
              onClick={() => {
                openAlertModal();
                // deleteUserInfo();
              }}
            >
              {t(`button.withdraw`)}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
