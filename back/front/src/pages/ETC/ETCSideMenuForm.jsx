/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import styles from './ETCSideMenuForm.module.scss';
import fontStyles from '../../styles/scss/Font.module.scss';
import { hasAccessToken } from '../../utils/storage/tokenCookie.jsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import {
  getPathWithLang,
  P9, P10, P11, P12,
} from '../../config/route/UrlPaths.jsx';
import { useLanguageChange } from '@/hooks';

const isNative = Capacitor.isNativePlatform();

const ETCSideMenuForm = ({ setPathName, ...props }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const PATHS = getPathWithLang(browserLanguage);

  const handleLinkClick = pathname => {
    if (setPathName) setPathName(pathname);
  };

  return (
    <div className={styles['menu']}>
      <div>
        <h2
          className={`${
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-title']
              : fontStyles['korean-font-title']
          }`}
        >
          {t(`header.more`)}
        </h2>
      </div>
      <ul>
        <li onClick={() => handleLinkClick('')}>
          <Link
            to={PATHS.P9}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.terms-of-service`)}</div>
          </Link>
        </li>
        <li onClick={() => handleLinkClick(P12)}>
          <Link
            to={PATHS.P12}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.privacy-policy`)}</div>
          </Link>
        </li>
        <li onClick={() => handleLinkClick(P10)}>
          <Link
            to={PATHS.P10}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.business-info`)}</div>
          </Link>
        </li>
        {isNative && (
          <li onClick={() => handleLinkClick(P11)}>
            <Link
              to={PATHS.P11}
              className={`${styles['link-style']} ${
                browserLanguage === 'ja'
                  ? fontStyles['japanese-font-content']
                  : fontStyles['korean-font-content']
              }`}
            >
              <div>{t(`more.settings`)}</div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ETCSideMenuForm;
