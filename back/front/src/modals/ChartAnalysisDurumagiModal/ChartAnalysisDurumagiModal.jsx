import { useTranslation } from 'react-i18next';
import styles from './ChartAnalysisDurumagiModal.module.scss';
import { copyText } from '../../utils/dom/copyText.jsx';
import { renderAnswerAsLines } from '../../lib/tarot/answer/renderAnswerAsLines.jsx';
import { useLanguageChange } from '@/hooks';
import Button from '../../components/common/Button.jsx';
import React, { useEffect, useRef } from 'react';
import { detectComputer } from '../../utils/device/detectComputer.js';

export const ChartAnalysisDurumagiModal = ({ ...props }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const JSXTagArr = [...renderAnswerAsLines(t(`content.chart_content`))];
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    return () => {
      scrollContainerRef.current = null;
    };
  }, []);

  const handleScroll = event => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const delta = event.deltaY;

    if (scrollContainerRef.current) {
      // deltaY를 15로 나누어 더 미세한 스크롤 조정 (숫자가 클수록 더 미세하게 움직임)
      const scrollAmount = delta / 15;
      scrollContainerRef.current.scrollTop += scrollAmount;
    }
    return false;
  };

  // 스크롤 이벤트 리스너 직접 추가 (passive: false로 기본 동작 완전 차단)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, {
      passive: false,
      capture: true,
    });

    return () => {
      container.removeEventListener('wheel', handleScroll, {
        passive: false,
        capture: true,
      });
    };
  }, []);
  const openBlinkModalForCopy = () => {
    if (
      props?.updateCopyBlinkModalOpen !== undefined &&
      props?.updateCopyBlinkModalOpen !== null &&
      detectComputer() === true
    )
      props?.updateCopyBlinkModalOpen(true);
  };
  const openBlinkModalForSave = () => {
    if (
      props?.updateSaveBlinkModalOpen !== undefined &&
      props?.updateSaveBlinkModalOpen !== null
    )
      props?.updateSaveBlinkModalOpen(true);
  };

  return (
    <>
      <div className={styles['chart-analyze-durumagi']}>
        <div className={`${styles['durumagi-box']}`}>
          {browserLanguage === 'ja' ? (
            <div
              className={styles['content-japanese']}
              ref={scrollContainerRef}
              style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }}
            >
              {JSXTagArr}
            </div>
          ) : (
            <div
              className={styles['content']}
              ref={scrollContainerRef}
              style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }}
            >
              {JSXTagArr}
            </div>
          )}

          <div className={styles['btn-box']}>
            {browserLanguage === 'ja' ? (
              <>
                <Button
                  className={styles['text-save-btn-japanese']}
                  onClick={() => {
                    copyText(JSXTagArr);
                    openBlinkModalForCopy();
                  }}
                >
                  {t(`button.copy`)}
                </Button>
                {/* <Button
                  className={styles['text-save-btn-japanese']}
                  onClick={() => {
                    openBlinkModalForSave();
                  }}
                >
                  {t(`button.text-save`)}
                </Button> */}
              </>
            ) : (
              <>
                <Button
                  className={styles['text-save-btn']}
                  onClick={() => {
                    copyText(JSXTagArr);
                    openBlinkModalForCopy();
                  }}
                >
                  {t(`button.copy`)}
                </Button>
                {/* <Button
                  className={styles['text-save-btn']}
                  onClick={() => {
                    openBlinkModalForSave();
                  }}
                >
                  {t(`button.text-save`)}
                </Button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
