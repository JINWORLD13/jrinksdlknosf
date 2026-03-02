import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './QuestionHistoryListModal.module.scss';
import CancelButton from '../../components/common/CancelButton.jsx';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import {
  getQuestionSets,
  formatQuestionDate,
  deleteQuestionSet,
} from '@/utils/storage/questionHistory';
import { useModalBackHandler } from '../../contexts/ModalBackHandlerContext';

const QuestionHistoryListModal = ({
  isOpen,
  onClose,
  onSelectQuestion,
  userInfo,
}) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const [questionSets, setQuestionSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { registerModal, unregisterModal } = useModalBackHandler();

  useEffect(() => {
    if (isOpen) {
      loadQuestionSets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadQuestionSets = async () => {
    setIsLoading(true);
    try {
      const sets = await getQuestionSets(userInfo?.id);
      // 현재 언어에 맞는 질문만 필터링 (legacy 데이터는 'ko'로 간주하거나 모두 보여줄 수도 있지만, 여기서는 browserLanguage와 일치하는 것만)
      // 만약 기존 데이터(language 필드 없는 것)를 다 보여주고 싶다면 조건을 (item.language === browserLanguage || !item.language) 로 변경 가능.
      // 하지만 질문 목록 분리가 목적이므로 일치하는 것만 필터링. (기존 데이터는 'ko'로 저장된 것이 많을테니, 한국어 사용자는 보일 것임)
      const filteredSets = sets.filter(
        item => (item.language || 'ko') === browserLanguage
      );
      setQuestionSets(filteredSets);
    } catch (error) {
      console.error('Failed to load question sets:', error);
      setQuestionSets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = questionSet => {
    if (onSelectQuestion) {
      onSelectQuestion(questionSet);
    }
  };

  const handleDelete = async (e, questionId) => {
    e.stopPropagation(); // 리스트 항목 클릭 이벤트 방지
    try {
      await deleteQuestionSet(questionId, userInfo?.id);
      await loadQuestionSets(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to delete question set:', error);
    }
  };

  const closeModal = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onClose) {
      onClose();
    }
  };

  // 모달이 열릴 때 body 스크롤 방지 및 백 핸들러 등록
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // 모달 백 핸들러 등록 (ESC 키 및 디바이스 백 버튼)
      const modalId = 'question-history-list-modal';
      registerModal(modalId, () => {
        if (onClose) {
          onClose();
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
  }, [isOpen, onClose, registerModal, unregisterModal]);

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

  if (!isOpen) return null;
  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div>
      <div
        className={styles['backdrop']}
        onClick={closeModal}
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
          <p>{t('question.history_title')}</p>
        </header>
        <div
          className={
            browserLanguage === 'ja'
              ? styles['modal-content-japanese']
              : styles['modal-content']
          }
        >
          {isLoading ? (
            <p>{t('question.loading')}</p>
          ) : questionSets.length === 0 ? (
            <p className={styles['empty-message']}>
              {t('question.history_empty')}
            </p>
          ) : (
            <ul className={styles['question-list']}>
              {questionSets.map(questionSet => (
                <li
                  key={questionSet.id}
                  className={styles['question-item']}
                  onClick={() => handleQuestionClick(questionSet)}
                >
                  <div className={styles['question-preview']}>
                    <p className={styles['question-text']}>
                      {questionSet.question}
                    </p>
                    <p className={styles['question-date']}>
                      {formatQuestionDate(questionSet.date, browserLanguage)}
                    </p>
                  </div>
                  <button
                    className={styles['delete-button']}
                    onClick={e => handleDelete(e, questionSet.id)}
                    title={t('question.delete')}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className={styles['button-box']}>
          <CancelButton
            className={styles['button']}
            onClick={closeModal}
            autoFocus={true}
          >
            {t('button.close')}
          </CancelButton>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default QuestionHistoryListModal;
