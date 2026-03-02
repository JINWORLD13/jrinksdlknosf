/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import styles from './ChartInfoForm.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TotalChart } from './Graph/TotalChart.jsx';
import {
  P15, P16, P17, P18, P23,
  getPathWithLang,
} from '../../config/route/UrlPaths.jsx';
import { ChartAnalysisDurumagiModal } from '../../modals/ChartAnalysisDurumagiModal/ChartAnalysisDurumagiModal.jsx';
import { SubjectChart } from './Graph/SubjectChart.jsx';
import { findTopFrequentSubjects } from '../../lib/tarot/analysis/findTopFrequentSubjects.jsx';
import { findTopFrequentQuestionTopics } from '../../lib/tarot/analysis/findTopFrequentQuestionTopics.jsx';
import { useLanguageChange } from '@/hooks';
import { QuestionTopicChart } from './Graph/QuestionTopicChart.jsx';
import { DateChartOption } from './Option/DateChartOption.jsx';
import { QuestionChartOption } from './Option/QuestionChartOption.jsx';
import { SubjectChartOption } from './Option/SubjectChartOption.jsx';
import { QuestionTopicChartOption } from './Option/QuestionTopicChartOption.jsx';
import { QuestionOfTopicChartOption } from './Option/QuestionOfTopicChartOption.jsx';
import { ChartOption } from './Option/ChartOption.jsx';

const ChartInfoForm = ({
  userInfo,
  tarotHistory,
  pathName,
  setPathName,
  statistics,
  setStatistics,
  theme,
  setTheme,
  subject,
  setSubject,
  date,
  setDate,
  questionTopic,
  setQuestionTopic,
  questionOfTopic,
  setQuestionOfTopic,
  question,
  setQuestion,
  updateSaveBlinkModalOpen,
  updateCopyBlinkModalOpen,
  ...props
}) => {
  // tarotHistory[0]?.userInfo == ObjId가 나옴.
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const browserLanguage = useLanguageChange();
  const currentPath = location.pathname;

  // 이전 언어를 추적하기 위한 ref (초기값 null로 첫 렌더링 구분)
  const prevLanguageRef = useRef(null);
  // 초기화 완료 여부를 추적하기 위한 ref
  const isInitializedRef = useRef(false);

  //& navigate()에서 ()내부에 단어만 쓰면 현 url(부모페이지) 기준에서 상대경로로, ./부터 쓰면 메인 기준에서 상대경로로 이동
  //& Link의 to는 부모컴포넌트-자식컴포넌트-손자컴포넌트 각각의 계층에서 쓰면 그 상위 url 기준으로 갱신되는 거다.
  //& 최상위 option을 통해 path값(마이페이지에서 보여줄 컨텐츠 렌더용), statics값(하위 options들 렌더용)을 설정 및 라우트 이동.
  const handlePath = async e => {
    const statisticsOption = e.target.value;
    setStatistics(prev => statisticsOption);
    if (statisticsOption === 'total') {
      setPathName(`${P15}/${P16}`);
      navigate(getPathWithLang(browserLanguage).P16);
    }
    if (statisticsOption === 'target') {
      const topTenSubjectArr = findTopFrequentSubjects(
        tarotHistory,
        10,
        browserLanguage
      );

      //! option 태그 기본값을 설정
      setSubject(prev => topTenSubjectArr[0]);
      setQuestion(prev => t(`chart.statistics-total`));

      //! 최상위 options에서 고른 카테고리로 보여줄 컨텐츠를 정함
      setPathName(P17);
      navigate(getPathWithLang(browserLanguage).P17);
    }
    if (statisticsOption === 'question-topic') {
      const topTenQuestionTopicsArr = findTopFrequentQuestionTopics(
        tarotHistory,
        10,
        browserLanguage
      );

      //! option 태그 기본값을 설정
      setQuestionTopic(prev => topTenQuestionTopicsArr[0]);
      setQuestionOfTopic(prev => t(`chart.statistics-total`));
      setDate(prev => t(`chart.statistics-total`));

      //! 최상위 options에서 고른 카테고리로 보여줄 컨텐츠를 정함
      setPathName(P18);
      navigate(getPathWithLang(browserLanguage).P18);
    }
  };

  //& option 태그값을 설정
  const handleSubjectPath = async e => {
    const subjectStatisticsOption = e.target.value;
    setSubject(prev => {
      setQuestion(t(`chart.statistics-total`));
      setDate(t(`chart.statistics-total`));
      return subjectStatisticsOption;
    });
  };
  const handleQuestionPath = async e => {
    const questionStatisticsOption = e.target.value;
    setQuestion(prev => {
      setDate(t(`chart.statistics-total`));
      return questionStatisticsOption;
    });
  };

  const handleQuestionTopicPath = async e => {
    const questionTopicStatisticsOption = e.target.value;
    setQuestionTopic(prev => {
      setQuestionOfTopic(t(`chart.statistics-total`));
      setDate(t(`chart.statistics-total`));
      return questionTopicStatisticsOption;
    });
  };

  const handleQuestionOfTopicPath = async e => {
    const questionOfTopicStatisticsOption = e.target.value;
    setQuestionOfTopic(prev => {
      setDate(t(`chart.statistics-total`));
      return questionOfTopicStatisticsOption;
    });
  };
  const handleDatePath = async e => {
    const dateStatisticsOption = e.target.value;
    setDate(prev => {
      return dateStatisticsOption;
    });
  };

  // 초기 마운트 시 URL 기반으로 상태 초기화
  // tarotHistory가 로드된 후에 실행되도록 의존성 추가
  useEffect(() => {
    // 차트 페이지가 아니면 실행하지 않음
    if (!currentPath.includes(`/${P15}`)) {
      return;
    }

    // tarotHistory가 아직 로드되지 않았으면 대기
    if (!tarotHistory || tarotHistory.length === 0) {
      return;
    }

    // 이미 초기화되었고, 언어 변경 중이면 실행하지 않음 (언어 변경 useEffect에서 처리)
    if (
      isInitializedRef.current &&
      prevLanguageRef.current !== browserLanguage
    ) {
      return;
    }

    // URL 기반으로 현재 차트 타입 판단 및 초기화
    if (currentPath.includes(`/${P16}`)) {
      setStatistics('total');
      setPathName(`${P15}/${P16}`);
    } else if (currentPath.includes(`/${P17}`)) {
      // 주제별 통계 초기화
      const topTenSubjectArr = findTopFrequentSubjects(
        tarotHistory,
        10,
        browserLanguage
      );
      const totalText = t(`chart.statistics-total`);

      // 모든 상태 업데이트
      setStatistics('target');
      setPathName(P17);
      setSubject(topTenSubjectArr[0] || '');
      setQuestion(totalText);
      setDate(totalText);
    } else if (currentPath.includes(`/${P18}`)) {
      // 질문 주제별 통계 초기화
      const topTenQuestionTopicsArr = findTopFrequentQuestionTopics(
        tarotHistory,
        10,
        browserLanguage
      );
      const totalText = t(`chart.statistics-total`);

      // 모든 상태 업데이트
      setStatistics('question-topic');
      setPathName(P18);
      setQuestionTopic(topTenQuestionTopicsArr[0] || '');
      setQuestionOfTopic(totalText);
      setDate(totalText);
    } else {
      // 차트 페이지지만 특정 차트가 아닌 경우 기본값 리셋

      setStatistics('');
      setTheme('');
      setSubject('');
      setQuestionTopic('');
      setQuestionOfTopic('');
      setQuestion('');
    }

    // 초기화 완료 표시
    isInitializedRef.current = true;
  }, [currentPath, tarotHistory?.length, browserLanguage]); // URL 변경, tarotHistory 로드, 또는 언어 변경 시 실행

  // 언어 변경 시 현재 차트 타입과 옵션 상태 유지하면서 언어만 변경
  useEffect(() => {
    const prevLanguage = prevLanguageRef.current;
    const currentPathAtExecution = location.pathname; // 실행 시점의 경로

    // 초기 설정: 이전 언어가 없으면 현재 언어로 설정
    if (prevLanguage === null) {
      prevLanguageRef.current = browserLanguage;

      return; // 초기 설정만 하고 종료
    }

    // 실제로 언어가 변경되었는지 확인
    if (prevLanguage !== browserLanguage) {
      // currentPath가 차트 관련 경로일 때만 처리
      if (currentPathAtExecution && currentPathAtExecution.includes('chart')) {
        // 현재 URL에서 언어 부분만 변경 (가장 간단하고 안정적)
        // 예: /ja/mypage/chart/subjectchart → /ko/mypage/chart/subjectchart
        const pathParts = currentPathAtExecution.split('/');
        if (pathParts.length > 1) {
          pathParts[1] = browserLanguage; // 언어 부분만 교체
          const targetUrl = pathParts.join('/');

          // URL 언어만 변경 (pathName, statistics, subject 등 모든 상태 유지)
          navigate(targetUrl, { replace: true });

          // 번역 텍스트만 업데이트 (실제 선택 상태는 유지)
          const totalChartText = t(`chart.statistics-total`);

          // statistics는 이미 고정된 식별자('total', 'target', 'question-topic')이므로 업데이트 불필요
          if (currentPathAtExecution.includes(`/${P16}`)) {
            // 전체 통계 - statistics는 이미 'total'로 설정되어 있음
          } else if (
            currentPathAtExecution.includes(`/${P17}`)
          ) {
            // 주제별 통계 - 주제 데이터 새 언어로 리로드
            const topTenSubjectArr = findTopFrequentSubjects(
              tarotHistory,
              10,
              browserLanguage
            );

            // 현재 subject가 새 언어 목록에 있으면 유지, 없으면 무조건 첫 번째로 변경
            const currentSubjectExists = topTenSubjectArr.includes(subject);

            // question과 date를 "전체"로 리셋 (언어 변경 시 옵션 매칭 문제 방지)
            setQuestion(totalChartText);
            setDate(totalChartText);
          } else if (
            currentPathAtExecution.includes(
              `/${P18}`
            )
          ) {
            // 질문 주제별 통계 - 주제 데이터 새 언어로 리로드
            const topTenQuestionTopicsArr = findTopFrequentQuestionTopics(
              tarotHistory,
              10,
              browserLanguage
            );

            // 현재 questionTopic이 새 언어 목록에 있으면 유지, 없으면 무조건 첫 번째로 변경
            const currentTopicExists =
              topTenQuestionTopicsArr.includes(questionTopic);

            // questionOfTopic과 date를 "전체"로 리셋 (언어 변경 시 옵션 매칭 문제 방지)
            setQuestionOfTopic(totalChartText);
            setDate(totalChartText);
          }
        }
      }

      // 언어 변경 후 현재 언어를 저장 (다음 비교를 위해)
      prevLanguageRef.current = browserLanguage;
    }
  }, [browserLanguage]); // 언어 변경만 감지 (currentPath는 제외하여 navigate 후 재실행 방지)

  //! props로 setState를 주면, 바로바로 업데이트 되고, on-scene에서 setState 선언해서하면 안됨. 재렌더라해도, 새로고침(흰색배경 팝업)하고 컴포넌트(화면상엔 변화 없는건 그대로 있음)가 다지 재렌더링 될때 화면에 표시되는게 다르다.

  // 디버깅: 렌더링 상태 로그
  const expectedTotalPath = `${P15}/${P16}`;

  // pathName과 URL 모두 확인하여 더 안정적으로 렌더링 결정
  const isUrlMatchTotalChart = currentPath.includes(
    `/${P15}/${P16}`
  );
  const isUrlMatchQuestionTopic = currentPath.includes(
    `/${P15}/${P18}`
  );
  const isUrlMatchSubject = currentPath.includes(
    `/${P15}/${P17}`
  );

  // pathName 또는 URL이 일치하면 렌더링 (더 안정적)
  const willRenderTotal =
    pathName === expectedTotalPath || isUrlMatchTotalChart;
  const willRenderQuestionTopic =
    pathName === P18 || isUrlMatchQuestionTopic;
  const willRenderSubject =
    pathName === P17 || isUrlMatchSubject;

  // URL 기반 차트 타입 체크 (언어 변경 시에도 안정적)
  const isSubjectChartActive =
    willRenderSubject ||
    statistics === 'target' ||
    currentPath.includes(`/${P17}`);
  const isQuestionTopicChartActive =
    willRenderQuestionTopic ||
    statistics === 'question-topic' ||
    currentPath.includes(`/${P18}`);

  // 질문 주제별 통계: 3번째 태그(해당 주제의 질문)가 "전체"가 아닐 때만 4번째 태그(날짜) 표시
  const shouldShowDateInQuestionTopic =
    isQuestionTopicChartActive &&
    questionOfTopic &&
    questionOfTopic !== t(`chart.statistics-total`) &&
    !questionOfTopic.includes('전체') &&
    !questionOfTopic.includes('Total') &&
    !questionOfTopic.includes('合計');

  // 주제별 통계: 3번째 태그(질문)가 "전체"가 아닐 때만 4번째 태그(날짜) 표시
  const shouldShowDateInSubject =
    isSubjectChartActive &&
    question &&
    question !== t(`chart.statistics-total`) &&
    !question.includes('전체') &&
    !question.includes('Total') &&
    !question.includes('合計');

  return (
    <div className={styles['chart-info']}>
      <div className={styles['chart']}>
        <div className={styles['chart-option']}>
          <ChartOption handlePath={handlePath} statistics={statistics} />
          {isQuestionTopicChartActive ? (
            <QuestionTopicChartOption
              tarotHistory={tarotHistory}
              handleQuestionTopicPath={handleQuestionTopicPath}
              questionTopic={questionTopic}
              browserLanguage={browserLanguage}
            />
          ) : null}
          {isQuestionTopicChartActive ? (
            <QuestionOfTopicChartOption
              tarotHistory={tarotHistory}
              handleQuestionOfTopicPath={handleQuestionOfTopicPath}
              questionOfTopic={questionOfTopic}
              questionTopic={questionTopic}
              browserLanguage={browserLanguage}
            />
          ) : null}
          {isSubjectChartActive ? (
            <SubjectChartOption
              tarotHistory={tarotHistory}
              handleSubjectPath={handleSubjectPath}
              subject={subject}
              browserLanguage={browserLanguage}
            />
          ) : null}
          {shouldShowDateInQuestionTopic ? (
            <DateChartOption
              tarotHistory={tarotHistory}
              date={date}
              handleDatePath={handleDatePath}
              statistics={statistics}
              questionTopic={questionTopic}
              questionOfTopic={questionOfTopic}
              subject={subject}
              question={question}
              browserLanguage={browserLanguage}
            />
          ) : null}
          {isSubjectChartActive ? (
            <QuestionChartOption
              tarotHistory={tarotHistory}
              question={question}
              handleQuestionPath={handleQuestionPath}
              statistics={statistics}
              questionTopic={questionTopic}
              subject={subject}
              browserLanguage={browserLanguage}
            />
          ) : null}
          {shouldShowDateInSubject ? (
            <DateChartOption
              tarotHistory={tarotHistory}
              date={date}
              handleDatePath={handleDatePath}
              statistics={statistics}
              questionTopic={questionTopic}
              questionOfTopic={questionOfTopic}
              subject={subject}
              question={question}
              browserLanguage={browserLanguage}
            />
          ) : null}
        </div>
        {willRenderTotal ? (
          <TotalChart
            key={`total-chart-${browserLanguage}`}
            tarotHistory={tarotHistory}
          />
        ) : null}
        {willRenderQuestionTopic ? (
          <QuestionTopicChart
            key={`question-chart-${browserLanguage}-${questionTopic}`}
            tarotHistory={tarotHistory}
            questionTopic={questionTopic}
            questionOfTopic={questionOfTopic}
            date={date}
          />
        ) : null}
        {willRenderSubject ? (
          <SubjectChart
            key={`subject-chart-${browserLanguage}-${subject}`}
            tarotHistory={tarotHistory}
            subject={subject}
            question={question}
            date={date}
          />
        ) : null}
      </div>
      <div className={styles['chart-analyze']}>
        <ChartAnalysisDurumagiModal
          updateSaveBlinkModalOpen={updateSaveBlinkModalOpen}
          updateCopyBlinkModalOpen={updateCopyBlinkModalOpen}
        />
      </div>
    </div>
  );
};

export default ChartInfoForm;
