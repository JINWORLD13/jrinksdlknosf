import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './QuestionHistoryDetailModal.module.scss';
import Button from '../../components/common/Button.jsx';
import CancelButton from '../../components/common/CancelButton.jsx';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { formatQuestionDate } from '@/utils/storage/questionHistory';
import { useModalBackHandler } from '../../contexts/ModalBackHandlerContext';
import { getPayloadKeys } from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

const QuestionHistoryDetailModal = ({
  isOpen,
  onClose,
  questionSet,
  onUseQuestion,
  onBack,
}) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const { registerModal, unregisterModal } = useModalBackHandler();

  // 모달이 열릴 때 body 스크롤 방지 및 백 핸들러 등록
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // 모달 백 핸들러 등록 (ESC 키 및 디바이스 백 버튼)
      const modalId = 'question-history-detail-modal';
      registerModal(modalId, () => {
        if (onBack) {
          onBack();
        }
      });

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        unregisterModal(modalId);
      };
    }
  }, [isOpen, onBack, registerModal, unregisterModal]);

  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBack = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onBack) {
      onBack();
    }
  };

  const handleUseQuestion = () => {
    if (onUseQuestion && questionSet) {
      onUseQuestion(questionSet);
      closeModal();
    }
  };

  const handleBackClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onBack) {
      onBack();
    }
  };

  const handleBackdropTouchMove = e => {
    e.preventDefault();
  };

  const handleBackdropWheel = e => {
    e.preventDefault();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !questionSet) return null;
  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div>
      <div
        className={styles['backdrop']}
        onClick={handleBackClick}
        onTouchMove={handleBackdropTouchMove}
        onWheel={handleBackdropWheel}
      />
      <div className={styles['modal']}>
        <header
          className={
            browserLanguage === 'ja'
              ? styles['title-japanese']
              : styles['title']
          }
        >
          <p>{t('question.history_detail')}</p>
        </header>
        <div
          className={
            browserLanguage === 'ja'
              ? styles['modal-content-japanese']
              : styles['modal-content']
          }
        >
          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>{t('question.topic')}</p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q0] ? (
                questionSet?.[PK.q0]
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>
              {t('question.target_content')}
            </p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q3] ? (
                questionSet?.[PK.q3]
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>
              {t('question.counterpart')}
            </p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q2] ? (
                questionSet?.[PK.q2]
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>
              {t('question.relationships_modal')}
            </p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q3] && questionSet?.[PK.q4] ? (
                `${questionSet?.[PK.q3]} / ${questionSet?.[PK.q4]}`
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          {/* <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>{t('question.theme')}</p>
            <p className={styles['detail-value']}>
              {questionSet.theme ? questionSet.theme : <span className={styles['omitted']}>{t('question.omitted')}</span>}
            </p>
          </div> */}

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>{t('question.option')}</p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.o0] ||
              questionSet?.[PK.o1] ||
              questionSet?.[PK.o2] ? (
                <>
                  {questionSet?.[PK.o0] && (
                    <span className={styles['option-item']}>
                      {t('question.first_option')}
                      {questionSet?.[PK.o0]}
                    </span>
                  )}
                  {questionSet?.[PK.o1] && (
                    <span className={styles['option-item']}>
                      {t('question.second_option')}
                      {questionSet?.[PK.o1]}
                    </span>
                  )}
                  {questionSet?.[PK.o2] && (
                    <span className={styles['option-item']}>
                      {t('question.third_option')}
                      {questionSet?.[PK.o2]}
                    </span>
                  )}
                </>
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>
              {t('question.situation_modal')}
            </p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q6] ? (
                questionSet?.[PK.q6]
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>
              {t('question.question_modal')}
            </p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.q7] || (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>{t('question.spread')}</p>
            <p className={styles['detail-value']}>
              {questionSet?.[PK.r0] ? (
                questionSet?.[PK.r0]
              ) : (
                <span className={styles['omitted']}>
                  {t('question.omitted')}
                </span>
              )}
            </p>
          </div>

          <div className={styles['detail-section']}>
            <p className={styles['detail-label']}>{t('question.date')}</p>
            <p className={styles['detail-value']}>
              {formatQuestionDate(questionSet.date, browserLanguage)}
            </p>
          </div>
        </div>
        <footer className={styles['button-box']}>
          <Button
            className={styles['button']}
            onClick={handleUseQuestion}
            autoFocus={true}
          >
            {t('question.use_this_question')}
          </Button>
          <CancelButton className={styles['button']} onClick={handleBack}>
            {t('button.cancel')}
          </CancelButton>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default QuestionHistoryDetailModal;
