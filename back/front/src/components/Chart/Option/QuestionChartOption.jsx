import React from 'react';
import { useTranslation } from 'react-i18next';
import { findQuestionsOfSubject } from '../../../lib/tarot/analysis/findQuestionsWithTheSubject';
import styles from '../ChartInfoForm.module.scss';

export const QuestionChartOption = ({
  tarotHistory,
  question,
  handleQuestionPath,
  statistics,
  questionTopic,
  subject,
  browserLanguage,
  ...props
}) => {
  const { t } = useTranslation();

  // subject가 있고 statistics가 'target'일 때만 질문 목록 생성
  let questionsOfSubject = [];
  if (statistics === 'target' && subject && subject !== '') {
    const foundQuestions = findQuestionsOfSubject(
      tarotHistory,
      subject,
      browserLanguage
    );

    // Set을 사용하여 중복 제거
    const uniqueQuestionsSet = new Set(foundQuestions);
    questionsOfSubject = Array.from(uniqueQuestionsSet);
  }

  // 질문 목록이 없으면 렌더링하지 않음
  if (!questionsOfSubject || questionsOfSubject.length === 0) {
    return null;
  }

  return (
    <div>
      <select
        name="chart-option"
        id="chart-option"
        className={styles['chart-select']}
        value={question || t(`chart.statistics-total`)}
        onChange={handleQuestionPath}
      >
        <>
          <option value={t(`chart.statistics-total`)}>
            {t(`chart.statistics-total`)}
          </option>
          {questionsOfSubject.map((elem, i) => {
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
        </>
      </select>
    </div>
  );
};
