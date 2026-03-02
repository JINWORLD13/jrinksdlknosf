import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';
import styles from './ReadingTypeChoiceModal.module.scss';

/** 로컬 배경 이미지 (public) */
const CUSTOM_BG = '/assets/images/readingTypes/custom_reading_v2.svg';
const GENERAL_BG = '/assets/images/readingTypes/general_reading_v2.svg';

/**
 * 맞춤리딩 / 제너럴리딩 선택 창
 * - 맞춤리딩: 스프레드 선택 → 카드 뽑기 → AI 해석
 * - 제너럴리딩: 질문 선택 → 미리 작성된 해석 표시
 */
const ReadingTypeChoiceModal = ({
  onClose,
  onSelectCustom,
  onSelectGeneral,
  isCustomLocked = false,
  onSelectCustomLocked,
}) => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();
  const { registerModal, unregisterModal } = useModalBackHandler();

  const languageForConfig =
    browserLanguage === 'ja' ? 'ja' : browserLanguage === 'ko' ? 'ko' : 'en';

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // ESC 키·디바이스 뒤로가기 → 취소(닫기)와 동일
  useEffect(() => {
    const modalId = 'reading-type-choice-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  const handleCustom = () => {
    onClose?.();
    if (isCustomLocked) {
      onSelectCustomLocked?.();
      return;
    }
    onSelectCustom?.();
  };

  const handleGeneral = () => {
    onClose?.();
    onSelectGeneral?.();
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
        aria-labelledby="reading-type-title"
        data-lang={languageForConfig}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="reading-type-title" className={styles.title}>
          {t('readingTypeChoice.title', '리딩 방식을 선택하세요')}
        </h2>
        <div className={styles.cardGrid}>
          <button
            type="button"
            className={`${styles.card} ${
              isCustomLocked ? styles.cardLocked : ''
            }`}
            onClick={handleCustom}
            aria-disabled={isCustomLocked}
            aria-label={t('readingTypeChoice.custom', '맞춤 리딩')}
            style={{ backgroundImage: `url(${CUSTOM_BG})` }}
          >
            {isCustomLocked && (
              <>
                <div className={styles.lockBadge} aria-hidden="true">
                  {t('readingTypeChoice.locked', '잠김')}
                </div>
                <div className={styles.lockCenter} aria-hidden="true">
                  <svg
                    className={styles.lockIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 10V8.25C7.5 5.76472 9.51472 3.75 12 3.75C14.4853 3.75 16.5 5.76472 16.5 8.25V10"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.75 10H17.25C18.0784 10 18.75 10.6716 18.75 11.5V18.25C18.75 19.0784 18.0784 19.75 17.25 19.75H6.75C5.92157 19.75 5.25 19.0784 5.25 18.25V11.5C5.25 10.6716 5.92157 10 6.75 10Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 14V16.25"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </>
            )}
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>
                <span className={styles.cardLabelRow}>
                  <span>{t('readingTypeChoice.custom', '맞춤 리딩')}</span>
                </span>
              </span>
            </div>
          </button>
          <button
            type="button"
            className={styles.card}
            onClick={handleGeneral}
            aria-label={t('readingTypeChoice.general', '제너럴 리딩')}
            style={{ backgroundImage: `url(${GENERAL_BG})` }}
          >
            <div className={styles.cardOverlay}>
              <span className={styles.cardLabel}>
                {t('readingTypeChoice.general', '제너럴 리딩')}
              </span>
            </div>
          </button>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('common.close', '닫기')}
        >
          {t('common.cancel', '취소')}
        </button>
      </div>
    </div>
  );
};

export default ReadingTypeChoiceModal;
