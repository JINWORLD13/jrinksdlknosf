import React from 'react';
import { useTranslation } from 'react-i18next';

export const DisclaimerSection = ({ styles }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['disclaimer']}>
      <div className={styles['disclaimer-text']}>{t('form.disclaimer')}</div>
    </div>
  );
};
