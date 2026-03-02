import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGeneralReadingCardImageUrl,
  getQuestionsForLanguage,
} from '@/lib/tarot/generalReading';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';
import styles from './GeneralReadingQuestionModal.module.scss';

/** id → 표시용 제목 (예: fortune_3 → "fortune 3") — 버튼에 love 1, career 3 등 문구 비표시로 아래 span 주석 처리 */
const idToTitle = id => (id || '').replace(/_/g, ' ');

const GeneralReadingQuestionModal = ({ onClose, onSelectQuestion }) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const { registerModal, unregisterModal } = useModalBackHandler();
  const languageForConfig =
    browserLanguage === 'ja' ? 'ja' : browserLanguage === 'ko' ? 'ko' : 'en';
  const questions = getQuestionsForLanguage(languageForConfig);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // ESC 키·디바이스 뒤로가기 → 취소(닫기)와 동일
  useEffect(() => {
    const modalId = 'general-reading-question-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  const handleSelect = (id, text) => {
    onClose?.();
    onSelectQuestion?.(id, text);
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.backdrop}
        onClick={onClose}
        onTouchStart={onClose}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="general-reading-title"
        data-lang={languageForConfig}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="general-reading-title" className={styles.title}>
          {t('generalReading.questionTitle')}
        </h2>
        <div className={styles.cardGrid}>
          {questions.map(({ id, text }) => {
            const imageUrl = getGeneralReadingCardImageUrl(id);
            return (
              <button
                key={id}
                type="button"
                className={styles.card}
                onClick={() => handleSelect(id, text)}
                aria-label={text}
              >
                <div className={styles.iconWrap}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt=""
                      className={styles.cardIcon}
                      aria-hidden="true"
                    />
                  )}
                </div>
                {/* love 1, career 3 등 문구 비표시
                <span className={styles.cardTitle}>{idToTitle(id)}</span>
                */}
                <div className={styles.cardBottom}>
                  <span className={styles.cardLabel}>{text}</span>
                  {/* 가격 표시 주석 처리
                  <div className={styles.cardPriceRow}>
                    <StarIcon
                      className={styles.priceStarIcon}
                      aria-hidden="true"
                    />
                    <span className={styles.originalPrice}>5</span>
                    <span className={styles.salePrice}>2</span>
                  </div>
                  */}
                </div>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('common.close')}
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};

export default GeneralReadingQuestionModal;
