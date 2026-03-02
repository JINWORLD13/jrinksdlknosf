import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { InstructionButton } from '../../../components/common/InstructionButton';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { getPayloadKeys } from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

export const RelationshipBox = ({
  styles,
  setInstructionOpen,
  setQuestionKind,
  questionFormInTarotModal,
  handleQuestionFormInTarotModal,
  questionForm,
  isSubmittedMode,
  ...props
}) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const relationshipSubjectKey = PK.q3;
  const relationshipObjectKey = PK.q4;
  return (
    <div
      className={`${
        isSubmittedMode ? styles['submitted-box'] : styles['question-box']
      }`}
    >
      <div className={styles['input-container']}>
        <div
          className={`${styles['label-box']} ${
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-label']
              : fontStyles['korean-font-label']
          }`}
        >
          <div>{t(`question.relationships`)}</div>{' '}
          <InstructionButton
            onClick={e => {
              setInstructionOpen(prev => !prev);
              setQuestionKind(4);
            }}
          ></InstructionButton>
        </div>
        <div className={styles['input-box']}>
          <div className={`${styles['input-box-relationship']}`}>
            <div
              className={`${styles['input-box-subject']} ${
                browserLanguage === 'ja'
                  ? fontStyles['japanese-font-label']
                  : fontStyles['korean-font-label']
              }`}
            >
              <label htmlFor={relationshipSubjectKey}>
                {t(`question.relationship_subject`)}
              </label>
              {window.screen.width > 1366 && (
                <input
                  id={relationshipSubjectKey}
                  className={`${styles['input-relationship']} ${
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }`}
                  name={relationshipSubjectKey}
                  type="text"
                  value={
                    isSubmittedMode
                      ? questionForm?.[relationshipSubjectKey]
                      : questionFormInTarotModal?.[relationshipSubjectKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[relationshipSubjectKey]?.length === 0
                        ? t('question.omitted')
                        : t('question.relationship_instruction_subject')
                      : t('question.relationship_instruction_subject')
                  }
                  onChange={e => {
                    if (e.target.value.length <= 40) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              )}
              {window.screen.width <= 1366 && (
                <input
                  id={relationshipSubjectKey}
                  className={`${styles['input-relationship']} ${
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }`}
                  name={relationshipSubjectKey}
                  type="text"
                  value={
                    isSubmittedMode
                      ? questionForm?.[relationshipSubjectKey]
                      : questionFormInTarotModal?.[relationshipSubjectKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[relationshipSubjectKey]?.length === 0
                        ? t('question.omitted')
                        : t('question.relationship_instruction_subject')
                      : t('question.relationship_instruction_subject')
                  }
                  onChange={e => {
                    if (e.target.value.length <= 40) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              )}
            </div>
            <div
              className={`${styles['input-box-object']} ${
                browserLanguage === 'ja'
                  ? fontStyles['japanese-font-label']
                  : fontStyles['korean-font-label']
              }`}
            >
              <label htmlFor={relationshipObjectKey}>
                {t(`question.relationship_object`)}
              </label>
              {window.screen.width > 1366 && (
                <input
                  id={relationshipObjectKey}
                  className={`${styles['input-relationship']} ${
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }`}
                  name={relationshipObjectKey}
                  type="text"
                  value={
                    isSubmittedMode
                      ? questionForm?.[relationshipObjectKey]
                      : questionFormInTarotModal?.[relationshipObjectKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[relationshipObjectKey]?.length === 0
                        ? t('question.omitted')
                        : t('question.relationship_instruction_object')
                      : t('question.relationship_instruction_object')
                  }
                  onChange={e => {
                    if (e.target.value.length <= 40) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              )}
              {window.screen.width <= 1366 && (
                <input
                  id={relationshipObjectKey}
                  className={`${styles['input-relationship']} ${
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }`}
                  name={relationshipObjectKey}
                  type="text"
                  value={
                    isSubmittedMode
                      ? questionForm?.[relationshipObjectKey]
                      : questionFormInTarotModal?.[relationshipObjectKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[relationshipObjectKey]?.length === 0
                        ? t('question.omitted')
                        : t('question.relationship_instruction_object')
                      : t('question.relationship_instruction_object')
                  }
                  onChange={e => {
                    if (e.target.value.length <= 40) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
