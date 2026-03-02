/*eslint-disable*/
import React, { useState, useEffect, Suspense } from 'react';
import styles from './TarotSectionForm.module.scss';
import { useTranslation } from 'react-i18next';
import TarotSectionSideMenuForm from './TarotSectionSideMenuForm.jsx';
import { P5, P6, P7 } from '../../config/route/UrlPaths.jsx';
import TarotExplanationForm from './Explanation/TarotExplanationForm.jsx';
import TarotLearningForm from './Learning/TarotLearningForm.jsx';
import TarotCardPrincipleForm from './Principle/TarotCardPrincipleForm.jsx';
import LoadingForm from '../../components/Loading/Loading.jsx';

const TarotSectionForm = () => {
  const fullUrl = window.location.href;
  const { t } = useTranslation();
  const [pathName, setPathName] = useState('');
  useEffect(() => {
    const domain =
      import.meta.env.VITE_SERVER_URL;
    switch (fullUrl) {
      case `${domain}/${P5}`:
        setPathName(P5);
        break;
      case `${domain}/${P6}`:
        setPathName(P6);
        break;
      case `${domain}/${P7}`:
        setPathName(P7);
        break;
      default:
      // 모든 case에 해당하지 않을 때 실행되는 코드
    }
  }, [fullUrl]);

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className={styles['container']}>
        <div className={styles['container-box1']}>
          <TarotSectionSideMenuForm setPathName={setPathName} />
        </div>
        <div className={styles['container-box2']}>
          {pathName === P5 ? (
            <TarotCardPrincipleForm />
          ) : null}
          {pathName === P6 ? (
            <TarotExplanationForm />
          ) : null}
          {pathName === P7 ? <TarotLearningForm /> : null}
        </div>
      </div>
    </Suspense>
  );
};

export default TarotSectionForm;

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
