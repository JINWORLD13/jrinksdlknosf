/*eslint-disable*/
import React, { useState, useEffect, memo } from 'react';
import styles from './BusinessInfoForm.module.scss';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

const BusinessInfoForm = memo(({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const browserLanguage = useLanguageChange();

  return (
    <div
      className={`${
        browserLanguage === 'ja'
          ? styles['business-info-container-japanese']
          : styles['business-info-container']
      }`}
    >
      <div
        className={`${
          browserLanguage === 'ja'
            ? styles['business-info1-japanese']
            : styles['business-info1']
        }`}
      >
        <div>
          {browserLanguage === 'ko' ? (
            <>
              <div>상호명 : 진월드</div>
              {!isNative && (
                <>
                  <div>대표자 : {import.meta.env.VITE_REPRESENTATIVE}</div>
                  <div>사업자 등록번호 : {import.meta.env.VITE_BIZ_REG_NO}</div>
                  <div>
                    통신판매업신고번호 : {import.meta.env.VITE_MAIL_ORDER_NO}
                  </div>
                  <div>사업장 주소 : {import.meta.env.VITE_ADDRESS}</div>
                  <div>전화번호 : {import.meta.env.VITE_PHONE}</div>
                </>
              )}
              <div>이메일 : cosmostarotinfo@gmail.com</div>
              <div>웹사이트: {import.meta.env.VITE_SERVER_URL}</div>
              <div>
                구글플레이스토어(안드로이드):{' '}
                <a
                  href="https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot"
                  style={{
                    color: isHovered ? 'gold' : 'black',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  다운로드
                </a>
              </div>
            </>
          ) : (
            ''
          )}
          {browserLanguage === 'ja' ? (
            <>
              <div className={styles['business-details-japanese']}>
                会社名: JINWORLD
              </div>
              {!isNative && (
                <>
                  <div className={styles['business-details-japanese']}>
                    代表者: {import.meta.env.VITE_REPRESENTATIVE}
                  </div>
                  <div className={styles['business-details-japanese']}>
                    事業者登録番号: {import.meta.env.VITE_BIZ_REG_NO}
                  </div>
                  <div className={styles['business-details-japanese']}>
                    通信販売業登録番号: {import.meta.env.VITE_MAIL_ORDER_NO}
                  </div>
                  <div className={styles['business-details-japanese']}>
                    事業所住所: {import.meta.env.VITE_ADDRESS}
                  </div>
                  <div className={styles['business-details-japanese']}>
                    電話番号: {import.meta.env.VITE_PHONE}
                  </div>
                </>
              )}
              <div className={styles['business-details-japanese']}>
                電子メール : cosmostarotinfo@gmail.com
              </div>
              <div className={styles['business-details-japanese']}>
                ウェブサイト : {import.meta.env.VITE_SERVER_URL}
              </div>
              <div className={styles['business-details-japanese']}>
                Google Play Store(Android):{' '}
                <a
                  href="https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot"
                  style={{
                    color: isHovered ? 'gold' : 'black',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  ダウンロード
                </a>
              </div>
            </>
          ) : (
            ''
          )}
          {browserLanguage === 'en' ? (
            <>
              <div>Company Name: JINWORLD</div>
              {!isNative && (
                <>
                  <div>
                    Representative: {import.meta.env.VITE_REPRESENTATIVE}
                  </div>
                  <div>
                    Business Registration Number:{' '}
                    {import.meta.env.VITE_BIZ_REG_NO}
                  </div>
                  <div>
                    Online Sales Business Registration Number:{' '}
                    {import.meta.env.VITE_MAIL_ORDER_NO}
                  </div>
                  <div>Business Address: {import.meta.env.VITE_ADDRESS}</div>
                  <div>Phone Number: {import.meta.env.VITE_PHONE}</div>
                </>
              )}
              <div>Contact : cosmostarotinfo@gmail.com</div>
              <div>Web Site: {import.meta.env.VITE_SERVER_URL}</div>
              <div>
                Google Play Store(Android):{' '}
                <a
                  href="https://play.google.com/store/apps/details?id=com.cosmostarot.cosmostarot"
                  style={{
                    color: isHovered ? 'gold' : 'black',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Download
                </a>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});

export default BusinessInfoForm;

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

// console.log('tarotHistory._json : ', tarotHistory._json');
