import React from 'react';
import { useTranslation } from 'react-i18next';

export const ThemeExamplesSection = ({ styles }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['theme-examples']}>
      <div className={styles['theme-examples-title']}>
        {t('form.theme_examples')}:
      </div>
      <div className={styles['theme-examples-text']}>
        {t('form.theme_examples_content')}
      </div>
    </div>
  );
};
