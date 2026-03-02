import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./en/translation.json";
import translationKo from "./ko/translation.json";
import translationJa from "./ja/translation.json";


const resources = {
  en: {
    translation: translationEn
  },
  ko: {
    translation: translationKo
  },
  ja: {
    translation: translationJa
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.split('-')[0], // 기본 설정 언어, 'cimode'로 설정할 경우 키 값으로 출력된다.
    fallbackLng: "en", // 번역 파일에서 찾을 수 없는 경우 기본 언어
    supportedLngs: ['ko', 'en', 'ja'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false  // 이 부분 추가
    },
    // URL 파라미터로 언어를 관리하므로 localStorage 저장 비활성화
    detection: {
      caches: [] // localStorage, cookie 등에 저장하지 않음
    }
  });
  
export default i18n;
