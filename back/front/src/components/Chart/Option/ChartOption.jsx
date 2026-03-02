import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../ChartInfoForm.module.scss';

export const ChartOption = ({ handlePath, statistics, ...props }) => {
  const { t } = useTranslation();
  return (
    <div>
      <select
        name="chart-option"
        id="chart-option"
        className={styles['chart-select']}
        onChange={handlePath}
        value={statistics}
      >
        <option value="total">{t(`mypage.statistics-total`)}</option>
        <option value="question-topic">
          {t(`mypage.statistics-question-topic`)}
        </option>
        <option value="target">{t(`mypage.statistics-target`)}</option>
      </select>
    </div>
  );
};
