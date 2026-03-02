import React from 'react';
import { useLanguageChange } from '@/hooks';
import styles from './Navbar.module.scss';

/**
 * 언어 선택 드롭다운 메뉴 (데스크톱용)
 */
export const LanguageOptionMenu = ({ isLanguageMenuOpen, changeLanguage }) => {
  const browserLanguage = useLanguageChange();
  return (
    <>
      {isLanguageMenuOpen && (
        <ul className={styles['language-dropDown-box']}>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['language-dropDown-item-japanese']
                : styles['language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('en');
            }}
          >
            English
          </li>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['language-dropDown-item-japanese']
                : styles['language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('ko');
            }}
          >
            한국어
          </li>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['japanese-language-dropDown-item-japanese']
                : styles['japanese-language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('ja');
            }}
          >
            日本語
          </li>
        </ul>
      )}
    </>
  );
};

/**
 * 언어 선택 드롭다운 메뉴 (모바일 아이콘 메뉴용)
 */
export const LanguageOptionMenuForIcon = ({
  isLanguageMenuOpen,
  changeLanguage,
}) => {
  const browserLanguage = useLanguageChange();
  return (
    <>
      {isLanguageMenuOpen && (
        <ul className={styles['icon-language-dropDown-box']}>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['icon-language-dropDown-item-japanese']
                : styles['icon-language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('en');
            }}
          >
            English
          </li>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['icon-language-dropDown-item-japanese']
                : styles['icon-language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('ko');
            }}
          >
            한국어
          </li>
          <li
            className={`${
              browserLanguage === 'ja'
                ? styles['icon-japanese-language-dropDown-item-japanese']
                : styles['japanese-icon-language-dropDown-item']
            }`}
            onClick={() => {
              changeLanguage('ja');
            }}
          >
            日本語
          </li>
        </ul>
      )}
    </>
  );
};
