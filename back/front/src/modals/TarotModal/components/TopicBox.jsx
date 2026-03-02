import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { InstructionButton } from '../../../components/common/InstructionButton';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { getPayloadKeys } from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

export const TopicBox = ({
  styles,
  setInstructionOpen,
  setQuestionKind,
  questionFormInTarotModal,
  handleQuestionFormInTarotModal,
  isSubmittedMode,
  questionForm,
  ...props
}) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  const topicKey = PK.q0;
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
          <label
            htmlFor={topicKey}
            className={styles['question-topic-label']}
          >
            {t(`question.${topicKey}`)}
          </label>{' '}
          <InstructionButton
            onClick={e => {
              setInstructionOpen(prev => !prev);
              setQuestionKind(1);
            }}
          ></InstructionButton>
        </div>
        <div className={styles['input-box']}>
          <input
            id={topicKey}
            name={topicKey}
            type="text"
            className={
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-input']
                : fontStyles['korean-font-input']
            }
            value={
              isSubmittedMode
                ? questionForm?.[topicKey]
                : questionFormInTarotModal?.[topicKey]
            }
            placeholder={
              isSubmittedMode
                ? questionForm?.[topicKey]?.length === 0
                  ? t('question.omitted')
                  : t(`question.${topicKey}_instruction`)
                : t(`question.${topicKey}_instruction`)
            }
            onChange={e => {
              if (e.target.value.length <= 40) {
                handleQuestionFormInTarotModal(e);
              }
            }}
            autoComplete="off"
            readOnly={isSubmittedMode}
          />
        </div>
      </div>
    </div>
  );
};
