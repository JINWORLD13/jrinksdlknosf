/*eslint-disable*/
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ETCForm.module.scss';
import { useTranslation } from 'react-i18next';
import ETCSideMenuForm from './ETCSideMenuForm.jsx';
import { Capacitor } from '@capacitor/core';
import { P9, P10, P11, P12 } from '@/config/route/UrlPaths';
import { getPathWithLang } from '@/config/route/UrlPaths';
import BusinessInfoForm from './Business/BusinessInfoForm';
import PrivacyPolicyForm from './Terms/PrivacyPolicyForm';
import TermsOfServiceForm from './Terms/TermsOfServiceForm';
import SettingsForm from './Settings/SettingsForm';
import LoadingForm from '@/components/Loading/Loading';
import { useLanguageChange } from '@/hooks';

const isNative = Capacitor.isNativePlatform();

const ETCForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pathName, setPathName] = useState('');
  const browserLanguage = useLanguageChange();

  useEffect(() => {
    const pathname = location.pathname;

    // 설정 페이지는 네이티브에서만 접근 가능. 웹에서 /etc/settings 접근 시 이용약관으로 리다이렉트
    if (pathname.includes(`/${P9}/${P11}`) && !isNative) {
      navigate(getPathWithLang(browserLanguage).P9, { replace: true });
      setPathName('');
      return;
    }
    if (pathname.includes(`/${P9}/${P11}`)) setPathName(P11);
    else if (pathname.includes(`/${P9}/${P10}`)) setPathName(P10);
    else if (pathname.includes(`/${P9}/${P12}`)) setPathName(P12);
    else if (pathname.endsWith(`/${P9}`)) setPathName('');
    else setPathName('');
  }, [location.pathname, browserLanguage, navigate, isNative]);

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className={styles['container']}>
        <div className={styles['container-box1']}>
          <ETCSideMenuForm />
        </div>
        <div className={styles['container-box2']}>
          {pathName === P11 && isNative ? <SettingsForm /> : null}
          {pathName === '' ? <TermsOfServiceForm /> : null}
          {pathName === P12 ? <PrivacyPolicyForm /> : null}
          {pathName === P10 ? <BusinessInfoForm /> : null}
        </div>
      </div>
    </Suspense>
  );
};

export default ETCForm;

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

// console.log('tarotHistory._json : ', tarotHistory._json);
