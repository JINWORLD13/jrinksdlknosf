/*eslint-disable*/
import React, { useState, useEffect, memo } from 'react';
import styles from '../../../styles/scss/UserInfoForm.module.scss';
import { hasAccessToken } from '../../../utils/storage/tokenCookie.jsx';
import { Link, useNavigate } from 'react-router-dom';
import QuestionInfo from '../question/QuestionInfo.jsx';
import { TarotCountRecord } from '../tarot/TarotCountRecord.jsx';
import { UserInfo } from './UserInfo.jsx';
import { useLanguageChange } from '@/hooks';
import { UserVoucherInfo } from '../voucher/UserVoucherInfo.jsx';
import { Capacitor } from '@capacitor/core';
import { TicketIcon } from '../../../modals/PurchaseModal/InAppPurchase/components/TicketIcon.jsx';
import { isAdsFreePassValid } from '../../../lib/user/isAdsFreePassValid.jsx';
const isNative = Capacitor.isNativePlatform();

const UserInfoForm = memo(
  ({
    userInfo,
    tarotHistory,
    setAnswerModalOpen,
    updateAnswerForm,
    updateTarotAlertModalOpen,
    updateUserAlertModalOpen,
    updateTarotAndIndexInfo,
    isInAppPurchaseOpen,
    setInAppPurchaseOpen,
    isClickedForInvisible,
    handleDeleteTarotHistory,
    updateChargeModalOpen,
    resultOfHasUserEmail,
    ...props
  }) => {
    const navigate = useNavigate();
    const browserLanguage = useLanguageChange();

    // 광고제거권 보유 여부 확인 (유효한 것만)
    const hasAdsFreePass = isAdsFreePassValid(userInfo);
    const showIcon = hasAdsFreePass; // 광고제거 이용권이 있을 때만 아이콘 표시

    useEffect(() => {
      const handleOrientationChange = () => {
        if (window.screen.width < window.screen.height) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener('orientationchange', handleOrientationChange);

      return () => {
        window.removeEventListener(
          'orientationchange',
          handleOrientationChange
        );
      };
    }, []);
    if (hasAccessToken() === false && isNative === false) return;

    return (
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['user-info-container-japanese']
            : styles['user-info-container']
        }`}
      >
        <div
          className={`${
            browserLanguage === 'ja'
              ? styles['user-info1-japanese']
              : styles['user-info1']
          }`}
        >
          <div
            className={`${
              browserLanguage === 'ja'
                ? styles['user-info1-box1-japanese']
                : styles['user-info1-box1']
            }`}
          >
            {showIcon && (
              <div className={styles['icon-badge']}>
                <TicketIcon
                  width="32"
                  height="32"
                  className={styles['badge-icon']}
                  title={
                    hasAdsFreePass ? '광고제거 이용권 보유' : '타로 이용권 보유'
                  }
                  style={{ color: '#DC2626' }}
                />
              </div>
            )}
            <UserInfo
              userInfo={userInfo}
              updateUserAlertModalOpen={updateUserAlertModalOpen}
              updateChargeModalOpen={updateChargeModalOpen}
            />
          </div>
          <div
            className={`${
              browserLanguage === 'ja'
                ? styles['user-info1-box2-japanese']
                : styles['user-info1-box2']
            }`}
          >
            <UserVoucherInfo
              userInfo={userInfo}
              updateUserAlertModalOpen={updateUserAlertModalOpen}
              updateChargeModalOpen={updateChargeModalOpen}
              isInAppPurchaseOpen={isInAppPurchaseOpen}
              setInAppPurchaseOpen={setInAppPurchaseOpen}
              resultOfHasUserEmail={resultOfHasUserEmail}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default UserInfoForm;

// withCredentials: true는 서버에 요청 시에 인증 정보를 함께 보내도록 하는 옵션일 것입니다. 보통 쿠키를 사용하는 세션 기반 인증에서 필요한 옵션입니다.
// data.user._json은 일반적으로 OAuth 인증을 통해 얻은 사용자 정보에서 사용자의 추가 정보(사용자의 이메일, 이름, 프로필 사진 URL 등)를 담고 있는 객체
// 언더스코어(_)는 객체의 프로퍼티 이름. 즉,  _json은 단순히 객체의 속성 이름
// 추출한 userInfo 객체의 _json 속성
// _json이라는 이름의 속성은 주로 OAuth 인증 프로세스에서 사용됩니다. 일반적으로 OAuth 공급자로부터 반환되는 사용자 정보가 JSON 형식으로 제공되는데, 이 정보는 _json이라는 속성에 담겨 있을 수 있습니다.
// {
//   "login": "example_user",
//   "id": 123456,
//   "name": "John Doe",
//   "email": "john@example.com"
//   // ... 기타 사용자 정보
// }
// 이런식으로 나옴.

