import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import i18n from '../../locales/i18n.js';

const useLanguageChange = () => {
  const { lang: paramLang } = useParams();
  const initialLang = ['en', 'ko', 'ja'].includes(paramLang)
    ? paramLang
    : i18n.language;
  const [browserLanguage, setBrowserLanguage] = useState(initialLang);

  // URL 파라미터 변경 시 i18n 동기화
  useEffect(() => {
    if (browserLanguage !== i18n.language) {
      i18n.changeLanguage(browserLanguage);
    }
  }, [browserLanguage]);

  // i18n 이벤트 수신
  useEffect(() => {
    const onChange = newLang => setBrowserLanguage(newLang);
    i18n.on('languageChanged', onChange);
    return () => i18n.off('languageChanged', onChange);
  }, []);

  return browserLanguage;
};
export default useLanguageChange;
