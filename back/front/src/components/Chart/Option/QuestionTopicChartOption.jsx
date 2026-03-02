import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../ChartInfoForm.module.scss';
import { findTopFrequentQuestionTopics } from '../../../lib/tarot/analysis/findTopFrequentQuestionTopics';
import { isDevelopmentMode } from '@/utils/constants';

export const QuestionTopicChartOption = ({
  tarotHistory,
  handleQuestionTopicPath,
  questionTopic,
  browserLanguage,
  ...props
}) => {
  const { t } = useTranslation();

  if (isDevelopmentMode) {
    console.log('QuestionTopicChartOption props:', {
      tarotHistoryLength: tarotHistory?.length,
      browserLanguage,
      questionTopic,
    });
  }

  // 숫자 조정 가능
  const topTenArr = findTopFrequentQuestionTopics(
    tarotHistory,
    10, //! 1위에서 10위까지
    browserLanguage
  );

  if (isDevelopmentMode) {
    console.log('QuestionTopicChartOption topTenArr:', topTenArr);
  }

  return (
    <div>
      {topTenArr?.length > 0 && (
        <select
          name="chart-option"
          id="chart-option"
          className={styles['chart-select']}
          onChange={handleQuestionTopicPath}
          value={questionTopic}
        >
          {topTenArr.map((elem, i) => {
            return (
              <option key={i} value={elem}>
                {elem}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};
