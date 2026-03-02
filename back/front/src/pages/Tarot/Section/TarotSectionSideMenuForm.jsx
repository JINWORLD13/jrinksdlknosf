/*eslint-disable*/
import React from 'react';
import styles from './TarotSectionSideMenuForm.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { P5, P6, P7 } from '../../../config/route/UrlPaths.jsx';
import { useLanguageChange } from '@/hooks';

const TarotSectionSideMenuForm = ({ setPathName, ...props }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();

  return (
    <div className={styles['menu']}>
      <div>
        <h2
          className={`${
            browserLanguage === 'ja'
              ? styles['japanese-potta-font']
              : styles['korean-dongle-font']
          }`}
        >
          {t(`header.tarot`)}
        </h2>
      </div>
      <ul>
        <li
          onClick={() => {
            setPathName(P5);
          }}
        >
          <Link
            to={`/${browserLanguage}/${P5}`}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <div>{t(`mypage.tarot-principle`)}</div>
          </Link>
        </li>
        <li
          onClick={() => {
            setPathName(P6);
          }}
        >
          <Link
            to={`/${browserLanguage}/${P6}`}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <div>{t(`mypage.tarot-explanation`)}</div>
          </Link>
        </li>
        <li
          onClick={() => {
            setPathName(P7);
          }}
        >
          <Link
            to={`/${browserLanguage}/${P7}`}
            className={`${styles['link-style']} ${
              browserLanguage === 'ja'
                ? styles['japanese-potta-font2']
                : styles['korean-dongle-font2']
            }`}
          >
            <div>{t(`mypage.tarot-learning`)}</div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TarotSectionSideMenuForm;
