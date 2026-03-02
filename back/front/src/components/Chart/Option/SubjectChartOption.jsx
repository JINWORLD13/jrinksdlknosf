import React from 'react';
import { useTranslation } from 'react-i18next';
import { findTopFrequentSubjects } from '../../../lib/tarot/analysis/findTopFrequentSubjects';
import styles from '../ChartInfoForm.module.scss';
import { isDevelopmentMode } from '@/utils/constants';

export const SubjectChartOption = ({
  tarotHistory,
  handleSubjectPath,
  subject,
  browserLanguage,
  ...props
}) => {
  const { t } = useTranslation();
  // 最も多く聞かれたTop10主体（言語別に異なる）
  // Top 10 most asked subjects (varies by language)
  // 숫자 조정 가능
  // 数値は調整可能
  // Number is adjustable
  const topTenArr = findTopFrequentSubjects(tarotHistory, 10, browserLanguage);

  if (isDevelopmentMode) {
    console.log('SubjectChartOption:', {
      subject,
      browserLanguage,
      tarotHistoryLength: tarotHistory?.length,
      topTenArrLength: topTenArr?.length,
      topTenArr: topTenArr?.slice(0, 3),
    });
  }

  return (
    <div>
      {topTenArr?.length > 0 && (
        <select
          name="chart-option"
          id="chart-option"
          className={styles['chart-select']}
          onChange={handleSubjectPath}
          value={subject}
        >
          {topTenArr?.map((elem, i) => {
            return (
              <option value={elem} key={i}>
                {elem}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};
