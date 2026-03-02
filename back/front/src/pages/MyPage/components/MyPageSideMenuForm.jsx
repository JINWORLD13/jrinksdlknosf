/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import styles from './MyPageSideMenuForm.module.scss';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { hasAccessToken } from '../../../utils/storage/tokenCookie.jsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPathWithLang, P14, P15, P16, P19, P10 } from '../../../config/route/UrlPaths.jsx';
import { useLanguageChange } from '@/hooks';

const MyPageSideMenuForm = ({ setPathName, setAnswerModalOpen, ...props }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const PATHS = getPathWithLang(browserLanguage);

  const handleLinkClick = pathname => {
    if (setPathName) setPathName(pathname);
    if (setAnswerModalOpen) setAnswerModalOpen(false);
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
          {t(`page_title.mypage`)}
        </h2>
      </div>
      <ul>
        <li onClick={() => handleLinkClick('')}>
          <Link
            to={PATHS.P13}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.user`)}</div>
          </Link>
        </li>
        <li onClick={() => handleLinkClick(P14)}>
          <Link
            to={PATHS.P14}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.tarot-history-info`)}</div>
          </Link>
        </li>
        <li
          onClick={() =>
            handleLinkClick(`${P15}/${P16}`)
          }
        >
          <Link
            to={PATHS.P16}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.statistics`)}</div>
          </Link>
        </li>
        <li onClick={() => handleLinkClick(P19)}>
          <Link
            to={PATHS.P19}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-content']
                : fontStyles['korean-font-content']
            }`}
          >
            <div>{t(`mypage.user-info-withdraw`)}</div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MyPageSideMenuForm;
