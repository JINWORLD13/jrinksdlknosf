import React, { useEffect, useRef, useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import styles from './TarotManualModal.module.scss';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button.jsx';
import CancelButton from '../../components/common/CancelButton.jsx';
import { renderAnswerAsLines } from '../../lib/tarot/answer/renderAnswerAsLines.jsx';

const TarotManualModal = ({ ...props }) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const MIN_MANUAL_FONT_SCALE = 0.85;
  const MAX_MANUAL_FONT_SCALE = 1.6;
  const [manualFontScale, setManualFontScale] = useState(1);

  const scrollContainerRef = useRef(null);

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

  const closeTarotManualModal = () => {
    if (
      props?.updateTarotManualModalOpen !== undefined &&
      props?.updateTarotManualModalOpen !== null
    )
      props?.updateTarotManualModalOpen(false);
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

  // 브라우저 백버튼 처리 (ESC키와 모바일 백버튼은 CancelButton에서 처리)
  useEffect(() => {
    // 브라우저 백버튼 이벤트 핸들러
    const handlePopState = event => {
      closeTarotManualModal();
    };

    // 히스토리에 상태 추가 (모달이 열릴 때)
    window.history.pushState({ tarotManualModalOpen: true }, '');

    // 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);

    // 클린업
    return () => {
      window.removeEventListener('popstate', handlePopState);

      // 히스토리 정리 (모달이 정상적으로 닫힐 때만)
      if (window.history.state?.tarotManualModalOpen) {
        window.history.go(-1);
      }
    };
  }, []);

  // i18n에서 매뉴얼 아이템을 가져와 문자열로 생성
  const manualItems =
    t('manual_modal.tarot-manual-items', { returnObjects: true }) || [];
  const isJapanese = browserLanguage === 'ja';

  return (
    <div>
      <div className={styles['backdrop']} onClick={props?.onConfirm} />
      <div className={styles['modal']}>
        <div
          className={`${
            isJapanese
              ? styles['modal-content-japanese']
              : styles['modal-content']
          }`}
          style={{ ['--manual-user-font-scale']: manualFontScale }}
        >
          <div
            className={styles['content']}
            ref={scrollContainerRef}
            style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }}
          >
            <div className={styles['header']}>
              <h3 className={styles['title']}>
                {t(`manual_modal.tarot-manual-title`)}
              </h3>
            </div>

            <div className={styles['manual-sections']}>
              {manualItems.map((item, index) => {
                // 첫 번째 항목: 소개 섹션
                if (index === 0) {
                  return (
                    <div key={index} className={styles['section-card']}>
                      <div className={styles['section-number']}>
                        {index + 1}
                      </div>
                      <div className={styles['section-content']}>
                        {renderAnswerAsLines(item, { strongColor: '#38bdf8' })}
                      </div>
                    </div>
                  );
                }
                // 두 번째 항목: 정확도 정보
                if (index === 1) {
                  return (
                    <div
                      key={index}
                      className={`${styles['section-card']} ${styles['info-card']}`}
                    >
                      <div className={styles['section-number']}>
                        {index + 1}
                      </div>
                      <div className={styles['section-content']}>
                        {renderAnswerAsLines(item, { strongColor: '#3b82f6' })}
                      </div>
                    </div>
                  );
                }
                // 세 번째 항목: 주의사항
                if (index === 2) {
                  return (
                    <div
                      key={index}
                      className={`${styles['section-card']} ${styles['warning-card']}`}
                    >
                      <div className={styles['section-number']}>
                        {index + 1}
                      </div>
                      <div className={styles['section-content']}>
                        {renderAnswerAsLines(item, { strongColor: '#ef4444' })}
                      </div>
                    </div>
                  );
                }
                // 네 번째 항목: 모드 선택 (긴 내용)
                if (index === 3) {
                  return (
                    <div
                      key={index}
                      className={`${styles['section-card']} ${styles['mode-card']}`}
                    >
                      <div className={styles['section-number']}>
                        {index + 1}
                      </div>
                      <div className={styles['section-header']}>
                        <h4 className={styles['section-title']}>
                          {isJapanese
                            ? 'モード選択'
                            : browserLanguage === 'en'
                            ? 'Mode Selection'
                            : '모드 선택'}
                        </h4>
                      </div>
                      <div className={styles['section-content']}>
                        {renderAnswerAsLines(item, { strongColor: '#38bdf8' })}
                      </div>
                    </div>
                  );
                }
                // 다섯 번째 항목: 카드 배열 선택
                if (index === 4) {
                  return (
                    <div
                      key={index}
                      className={`${styles['section-card']} ${styles['spread-card']}`}
                    >
                      <div className={styles['section-number']}>
                        {index + 1}
                      </div>
                      <div className={styles['section-header']}>
                        <h4 className={styles['section-title']}>
                          {isJapanese
                            ? 'カードの並べ方選択'
                            : browserLanguage === 'en'
                            ? 'Card Layout Selection'
                            : '카드 배열 선택'}
                        </h4>
                      </div>
                      <div className={styles['section-content']}>
                        {renderAnswerAsLines(item, { strongColor: '#10b981' })}
                      </div>
                    </div>
                  );
                }
                // 기본 항목
                return (
                  <div key={index} className={styles['section-card']}>
                    <div className={styles['section-number']}>{index + 1}</div>
                    <div className={styles['section-content']}>
                      {renderAnswerAsLines(item, { strongColor: '#38bdf8' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <footer className={styles['button-box']}>
            <Button
              className={`${styles['button']} ${styles['scale-button']}`}
              onClick={() => {
                setManualFontScale(prev =>
                  Math.min(prev * 1.1, MAX_MANUAL_FONT_SCALE)
                );
              }}
              disabled={manualFontScale >= MAX_MANUAL_FONT_SCALE}
              aria-label="Increase manual font size"
              title="+"
            >
              <Plus size={20} />
            </Button>
            <Button
              className={`${styles['button']} ${styles['scale-button']}`}
              onClick={() => {
                setManualFontScale(prev =>
                  Math.max(prev / 1.1, MIN_MANUAL_FONT_SCALE)
                );
              }}
              disabled={manualFontScale <= MIN_MANUAL_FONT_SCALE}
              aria-label="Decrease manual font size"
              title="-"
            >
              <Minus size={20} />
            </Button>
            <CancelButton
              className={`${styles['button']} ${styles['scale-button']}`}
              onClick={(e = null) => {
                closeTarotManualModal();
              }}
              title={t('button.close') || '닫기'}
            >
              <X size={20} />
            </CancelButton>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TarotManualModal;
