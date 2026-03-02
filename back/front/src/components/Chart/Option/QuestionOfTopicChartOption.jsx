import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../ChartInfoForm.module.scss';
import { findQuestionsOfTopic } from '../../../lib/tarot/analysis/findQuestionsOfTopic';

export const QuestionOfTopicChartOption = ({
  tarotHistory,
  handleQuestionOfTopicPath,
  questionOfTopic,
  questionTopic,
  browserLanguage,
  ...props
}) => {
  const { t } = useTranslation();

  // questionTopic이 없거나 빈 문자열이면 빈 배열 사용
  const questionsArr =
    questionTopic && questionTopic !== ''
      ? findQuestionsOfTopic(tarotHistory, questionTopic, browserLanguage)
      : [];

  // 질문 목록이 없으면 렌더링하지 않음
  if (!questionsArr || questionsArr.length === 0) {
    return null;
  }

  return (
    <div>
      <select
        name="chart-option"
        id="chart-option"
        className={styles['chart-select']}
        onChange={handleQuestionOfTopicPath}
        value={questionOfTopic || t(`chart.statistics-total`)}
      >
        <option value={t(`chart.statistics-total`)}>
          {t(`chart.statistics-total`)}
        </option>
        {questionsArr.map((elem, i) => {
          if (elem?.length > 50) {
            return (
              <option value={elem} key={i}>
                {elem.slice(0, 48) + '...'}
              </option>
            );
          }
          return (
            <option value={elem} key={i}>
              {elem}
            </option>
          );
        })}
      </select>
    </div>
  );
};
