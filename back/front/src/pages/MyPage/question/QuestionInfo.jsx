import React, { useState, useEffect, useRef } from 'react';
import styles from './QuestionForm.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  isWithinThisDay,
  isWithinThisWeek,
  isWithinThisMonth,
  isWithinThisThreeMonth,
} from '../../../utils/format/isTimeAgo.js';
import { useLanguageChange } from '@/hooks';
import { Trash2, MessageSquarePlus, HelpCircle } from 'lucide-react';
import Button from '../../../components/common/Button.jsx';
import { formattingDate } from '../../../utils/format/formatDate.jsx';
import { resolveCombinedReadingConfig } from '@/lib/tarot/spread/resolveCombinedSpreadInfo';

const QuestionInfo = ({
  tarotHistory = [],
  updateTarotHistory,
  setAnswerModalOpen,
  updateAnswerForm,
  updateTarotAlertModalOpen,
  updateTarotAndIndexInfo,
  isClickedForInvisible = [],
  handleAddQuestion,
  handleDeleteAllClick,
}) => {
  const [selectedHistory, setSelectedHistory] = useState(1);
  const [isWideScreen, setIsWideScreen] = useState(
    window.matchMedia('(min-width: 700px)').matches
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 700px)');
    const handleWidthChange = e => setIsWideScreen(e.matches);
    mediaQuery.addEventListener('change', handleWidthChange);
    return () => mediaQuery.removeEventListener('change', handleWidthChange);
  }, []);

  const timeFilters = {
    1: isWithinThisDay,
    2: isWithinThisWeek,
    3: isWithinThisMonth,
    4: isWithinThisThreeMonth,
  };

  const renderTarotHistory = filterFn => {
    if (!tarotHistory?.length) return null;
    return tarotHistory
      ?.filter(
        tarot =>
          browserLanguage === tarot?.language && (!filterFn || filterFn(tarot))
      )
      .map((tarot, i) => {
        // Normalize legacy/old records: original tarot may not have combinedSpreadInfo stored.
        // If combinedSpreadInfo is missing OR has empty cards, fall back to readingConfig cards.
        const normalizeTarotForAnswerForm = t => {
          return {
            ...t,
            combinedReadingConfig: resolveCombinedReadingConfig(
              t?.combinedReadingConfig,
              t?.readingConfig
            ),
          };
        };

        const normalizedTarot = normalizeTarotForAnswerForm(tarot);
        const formattedDate = formattingDate(
          normalizedTarot?.timeOfCounselling ?? normalizedTarot?.createdAt,
          browserLanguage
        );
        const additionalQuestionCount =
          normalizedTarot?.additionalQuestionCount !== undefined &&
          normalizedTarot?.additionalQuestionCount !== null
            ? normalizedTarot.additionalQuestionCount
            : 0;
        // 카운트 규칙: 원본은 0 유지, "추가 타로"가 1부터 시작하며 체인적으로 +1
        // 추가 질문 가능 여부는 카운트(2회 제한)로만 제어
        const isAdditionalQuestionDisabled = additionalQuestionCount >= 2;

        return (
          <div
            key={i}
            className={`${styles['tarot-history-item']} ${
              browserLanguage === 'ja'
                ? styles['tarot-history-item-japanese']
                : ''
            } ${isClickedForInvisible.includes(i) ? styles['invisible'] : ''}`}
            onClick={() => {
              setAnswerModalOpen(prev => !prev);
              updateAnswerForm(normalizedTarot);
            }}
          >
            <div className={styles['tarot-history-item-content']}>
              <div className={styles['tarot-history-item-info']}>
                <div
                  className={styles['tarot-history-item-label']}
                  title={t('mypage.question')}
                >
                  <HelpCircle size={20} color="gold" />
                </div>
                <div
                  className={`${
                    tarot.language === 'ja' && browserLanguage !== 'ja'
                      ? styles['font-japanese']
                      : ''
                  } ${
                    tarot.language !== 'ja' && browserLanguage === 'ja'
                      ? styles['font-english']
                      : ''
                  }`}
                >
                  {tarot?.questionData?.question}
                </div>
              </div>
              <div className={styles['tarot-history-item-date']}>
                {formattedDate}
              </div>
            </div>
            <div className={styles['tarot-history-item-action']}>
              {additionalQuestionCount < 2 && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    if (isAdditionalQuestionDisabled) return;
                    if (handleAddQuestion) {
                      handleAddQuestion(normalizedTarot);
                    }
                  }}
                  disabled={isAdditionalQuestionDisabled}
                  className={styles['additional-question-button']}
                  title={t('button.additional-question', {
                    current: Math.min(additionalQuestionCount, 2),
                    max: 2,
                  })}
                >
                  <MessageSquarePlus size={20} />
                  <span className={styles['count-badge']}>
                    ({Math.min(additionalQuestionCount, 2)}/2)
                  </span>
                </Button>
              )}
              <Button
                onClick={e => {
                  e.stopPropagation();
                  updateTarotAlertModalOpen(true);
                  updateTarotAndIndexInfo({ tarot: normalizedTarot, index: i });
                }}
                className={styles['delete-button']}
                title={t('button.delete')}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </div>
        );
      })
      .reverse();
  };

  const getHistoryCount = filterFn => {
    if (!tarotHistory?.length) return 0;
    return tarotHistory?.filter(
      tarot =>
        browserLanguage === tarot?.language && (!filterFn || filterFn(tarot))
    ).length;
  };

  const handleScroll = event => {
    event.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += event.deltaY > 0 ? 10 : -10;
    }
  };

  const menuItems = [
    { id: 1, label: t('mypage.question-today') },
    { id: 2, label: t('mypage.question-this-week') },
    { id: 3, label: t('mypage.question-this-month') },
    { id: 4, label: t('mypage.question-three-months') },
  ];

  return (
    <div
      className={`${styles['user-info3-body']} ${
        browserLanguage === 'ja' ? styles['user-info3-body-japanese'] : ''
      }`}
    >
      <div
        className={`${styles['user-info3-body-center']} ${
          browserLanguage === 'ja'
            ? styles['user-info3-body-center-japanese']
            : ''
        }`}
      >
        <div
          className={`${styles['tarot-info']} ${
            browserLanguage === 'ja' ? styles['tarot-info-japanese'] : ''
          }`}
        >
          <div
            className={`${styles['tarot-history-menu-container']} ${
              browserLanguage === 'ja'
                ? styles['tarot-history-menu-container-japanese']
                : ''
            }`}
          >
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`${styles['tarot-history-menu-box']} ${
                  browserLanguage === 'ja'
                    ? styles['tarot-history-menu-box-japanese']
                    : ''
                } ${
                  selectedHistory === item.id
                    ? browserLanguage === 'ja'
                      ? styles['tarot-history-menu-box-clicked-japanese']
                      : styles['tarot-history-menu-box-clicked']
                    : ''
                }`}
                onClick={() => setSelectedHistory(item.id)}
              >
                <span>{item.label}</span>
              </div>
            ))}
            {isWideScreen && (
              <div
                className={`${styles['tarot-history-record']} ${
                  browserLanguage === 'ja'
                    ? styles['tarot-history-record-japanese']
                    : ''
                }`}
              >
                <div>
                  <span>
                    {t(
                      `mypage.tarot-history-${
                        selectedHistory === 1
                          ? 'today'
                          : selectedHistory === 2
                          ? 'this-week'
                          : selectedHistory === 3
                          ? 'this-month'
                          : 'total'
                      }`
                    )}
                  </span>
                  <span>
                    {': '}
                    {getHistoryCount(timeFilters[selectedHistory])}
                    {t('mypage.times')}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div
            className={`${styles['tarot-history']} ${
              browserLanguage === 'ja' ? styles['tarot-history-japanese'] : ''
            }`}
            ref={scrollContainerRef}
            onWheel={handleScroll}
          >
            {renderTarotHistory(timeFilters[selectedHistory])}
          </div>
          {!isWideScreen && (
            <div
              className={`${styles['tarot-history-record-bottom']} ${
                browserLanguage === 'ja'
                  ? styles['tarot-history-record-bottom-japanese']
                  : ''
              }`}
            >
              <div>
                <span>
                  {t(
                    `mypage.tarot-history-${
                      selectedHistory === 1
                        ? 'today'
                        : selectedHistory === 2
                        ? 'this-week'
                        : selectedHistory === 3
                        ? 'this-month'
                        : 'total'
                    }`
                  )}
                </span>
                <span>
                  {': '}
                  {getHistoryCount(timeFilters[selectedHistory])}
                  {t('mypage.times')}
                </span>
              </div>
              {/* Mobile Only: Delete All Button (Left Aligned, Below Count) */}
              <div className={styles['mobile-delete-all-container']}>
                <Button
                  className={`${styles['mobile-delete-all-button']} ${
                    browserLanguage === 'ja'
                      ? styles['mobile-delete-all-button-japanese']
                      : ''
                  }`}
                  onClick={handleDeleteAllClick}
                >
                  {t('button.delete-all')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionInfo;
