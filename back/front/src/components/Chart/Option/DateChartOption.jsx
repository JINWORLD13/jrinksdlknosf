import { useTranslation } from 'react-i18next';
import { findTopFrequentQuestionTopics } from '../../../lib/tarot/analysis/findTopFrequentQuestionTopics';
import {
  findDatesOfTopicWithQuestion,
  findDatesOfTopic,
} from '../../../lib/tarot/analysis/findQuestionsWithTheTopic';
import styles from '../ChartInfoForm.module.scss';
import { findTopFrequentSubjects } from '../../../lib/tarot/analysis/findTopFrequentSubjects';
import { findDatesOfSubjectWithQuestion } from '../../../lib/tarot/analysis/findQuestionsWithTheSubject';
import React, { useEffect, useState } from 'react';

export const DateChartOption = ({
  tarotHistory,
  date,
  handleDatePath,
  statistics,
  questionTopic,
  questionOfTopic,
  subject,
  question,
  browserLanguage,
  ...props
}) => {
  const { t } = useTranslation();
  const [datesArr, setDatesArr] = useState([]);

  useEffect(() => {
    let dates = [];

    if (statistics === 'question-topic') {
      // 질문 주제별 통계 - 항상 날짜 표시
      if (questionOfTopic === t(`chart.statistics-total`)) {
        // questionOfTopic이 "전체"일 때는 해당 주제의 모든 날짜 표시
        dates = findDatesOfTopic(
          tarotHistory,
          questionTopic,
          questionOfTopic,
          browserLanguage
        );
      } else {
        // 특정 질문을 선택했을 때는 해당 질문의 날짜만 표시
        dates = findDatesOfTopicWithQuestion(
          tarotHistory,
          questionTopic,
          questionOfTopic,
          browserLanguage
        );
      }
    }

    if (statistics === 'target') {
      // 질문 대상별 통계 - question이 "통계-전체"가 아닐 때만 날짜 표시
      if (question !== t(`chart.statistics-total`)) {
        dates = findDatesOfSubjectWithQuestion(
          tarotHistory,
          subject,
          question,
          browserLanguage
        );
      }
    }

    // Set을 사용하여 중복 제거
    const uniqueDatesSet = new Set(dates);
    setDatesArr(Array.from(uniqueDatesSet));
  }, [
    statistics,
    tarotHistory,
    subject,
    question,
    questionTopic,
    questionOfTopic,
    browserLanguage,
    t,
  ]);


  return (
    <div>
      {statistics === 'question-topic' ? (
        <select
          name="chart-option"
          id="chart-option"
          className={styles['chart-select']}
          value={date}
          onChange={handleDatePath}
        >
          <option value={t(`chart.statistics-total`)}>
            {t(`chart.statistics-total`)}
          </option>
          {datesArr?.map((elem, i) => {
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
      ) : (
        datesArr?.length > 0 && (
          <select
            name="chart-option"
            id="chart-option"
            className={styles['chart-select']}
            value={date}
            onChange={handleDatePath}
          >
            <option value={t(`chart.statistics-total`)}>
              {t(`chart.statistics-total`)}
            </option>
            {datesArr?.map((elem, i) => {
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
        )
      )}
    </div>
  );
};
