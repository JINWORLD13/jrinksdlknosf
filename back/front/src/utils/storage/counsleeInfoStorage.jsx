/**
 * 내담자 정보 저장: 웹은 localStorage, 네이티브는 Capacitor Preferences
 * - 키에 이메일·언어 포함하여 계정별·언어별 구분 (counsleeInfoCosmos_<email>_<lang>)
 * - 저장 후 입력창에 그대로 유지, 같은 폼에서 수정·재저장 가능
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const KEY_PREFIX = 'counsleeInfoCosmos';
const isNative = Capacitor.isNativePlatform();

/** locale에서 언어 코드만 추출 (ko-KR → ko, en-US → en) */
export const normalizeLanguageForStorage = (locale = '') => {
  const lang = typeof locale === 'string' ? locale.split(/[-_]/)[0]?.toLowerCase() : '';
  return lang || 'ko';
};

/** 계정·언어 구분용 키 생성. email·language 없으면 레거시 호환용 키 */
const getStorageKey = (email, language) => {
  const e = email && typeof email === 'string' ? email.trim() : '';
  const lang = normalizeLanguageForStorage(language);
  if (e && lang) return `${KEY_PREFIX}_${e}_${lang}`;
  if (e) return `${KEY_PREFIX}_${e}`;
  return KEY_PREFIX;
};

const defaultCounsleeInfo = () => ({
  name: '',
  birthDate: '',
  gender: '',
  nationality: '',
  referenceNote: '',
});

/**
 * @param {string} [userEmail] - 계정 구분용
 * @param {string} [language] - 언어 구분용 (ko-KR, en, ja 등 → ko, en, ja로 정규화)
 * @returns {Promise<{ name: string, birthDate: string, gender: string, nationality: string, referenceNote: string }>}
 */
export const getCounsleeInfo = async (userEmail = '', language = '') => {
  const key = getStorageKey(userEmail, language);
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key });
      if (!value) return defaultCounsleeInfo();
      const parsed = JSON.parse(value);
      return { ...defaultCounsleeInfo(), ...parsed };
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultCounsleeInfo();
    const parsed = JSON.parse(raw);
    return { ...defaultCounsleeInfo(), ...parsed };
  } catch (e) {
    return defaultCounsleeInfo();
  }
};

/**
 * @param {{ name?: string, birthDate?: string, gender?: string, nationality?: string, referenceNote?: string }} info
 * @param {string} [userEmail] - 계정 구분용
 * @param {string} [language] - 언어 구분용
 * @returns {Promise<void>}
 */
export const setCounsleeInfo = async (info, userEmail = '', language = '') => {
  const key = getStorageKey(userEmail, language);
  const payload = { ...defaultCounsleeInfo(), ...info };
  const value = JSON.stringify(payload);
  if (isNative) {
    await Preferences.set({ key, value });
  } else {
    window.localStorage.setItem(key, value);
  }
};

/**
 * 현재 계정·언어의 내담자 정보 전부 삭제 (로컬 저장소에서 제거)
 * @param {string} [userEmail] - 계정 구분용
 * @param {string} [language] - 언어 구분용
 * @returns {Promise<void>}
 */
export const clearCounsleeInfo = async (userEmail = '', language = '') => {
  const key = getStorageKey(userEmail, language);
  try {
    if (isNative) {
      await Preferences.remove({ key });
    } else {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // 무시
  }
};
