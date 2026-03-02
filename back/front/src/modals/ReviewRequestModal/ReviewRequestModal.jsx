import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import styles from './ReviewRequestModal.module.scss';
import { useLanguageChange } from '@/hooks';
import { useModalBackHandler } from '@/contexts/ModalBackHandlerContext';

/**
 * 네이티브 앱에서 타로 결과를 처음 본 후 한 번만 표시되는 리뷰 요청 모달.
 * - 리뷰 쓰기: 스토어 리뷰 페이지로 이동 (또는 인앱 리뷰 플러그인 사용 시 네이티브 다이얼로그)
 * - 혜택: 스토어 정책상 리뷰와 직접 연계된 인앱 보상은 권장하지 않음. 감사 메시지로 대체.
 */
const ReviewRequestModal = ({ onClose, onWriteReview, isJapanese }) => {
  const { t } = useTranslation();
  const lang = useLanguageChange();
  const { registerModal, unregisterModal } = useModalBackHandler();

  // ESC 키·디바이스 뒤로가기 → 나중에(닫기)와 동일
  useEffect(() => {
    const modalId = 'review-request-modal';
    registerModal(modalId, onClose);
    return () => unregisterModal(modalId);
  }, [onClose, registerModal, unregisterModal]);

  const handleWriteReview = () => {
    onWriteReview?.();
    onClose?.();
  };

  const handleLater = () => {
    onClose?.();
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleLater}
      role="presentation"
    >
      <div
        className={`${styles.modal} ${lang === 'ja' ? styles.modalJa : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-desc"
      >
        <div className={styles.starWrap}>
          <Star
            className={styles.starIcon}
            size={48}
            strokeWidth={1.5}
            fill="currentColor"
            aria-hidden
          />
        </div>
        <h2 id="review-modal-title" className={styles.title}>
          {t('review_modal.title')}
        </h2>
        <p id="review-modal-desc" className={styles.desc}>
          {t('review_modal.desc')}
        </p>
        <p className={styles.thanks}>{t('review_modal.thanks')}</p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleWriteReview}
          >
            {t('review_modal.write_review')}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleLater}
          >
            {t('review_modal.later')}
          </button>
        </div>
      </div>
    </div>
  );
};

ReviewRequestModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onWriteReview: PropTypes.func,
  isJapanese: PropTypes.bool,
};

ReviewRequestModal.defaultProps = {
  onWriteReview: undefined,
  isJapanese: false,
};

export default ReviewRequestModal;
