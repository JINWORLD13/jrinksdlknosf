import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { InstructionButton } from '../../../components/common/InstructionButton';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { getPayloadKeys } from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

export const OptionBox = ({
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
  const firstOptionKey = PK.o0;
  const secondOptionKey = PK.o1;
  const thirdOptionKey = PK.o2;
  return (
    <div
      className={`${
        isSubmittedMode ? styles['submitted-box'] : styles['question-box']
      }`}
    >
      <div className={styles['input-container']}>
        <div className={styles['input-box']}>
          <div className={styles['input-box-relationship']}>
            <div className={styles['input-box-object']}>
              <div
                className={`${styles['label-box']} ${
                  browserLanguage === 'ja'
                    ? fontStyles['japanese-font-label']
                    : fontStyles['korean-font-label']
                }`}
              >
                <label className={styles['object-label']} htmlFor={firstOptionKey}>
                  {t(`question.first_option`)}
                </label>{' '}
                <InstructionButton
                  onClick={e => {
                    setInstructionOpen(prev => !prev);
                    setQuestionKind(7);
                  }}
                ></InstructionButton>
              </div>
              <div className={styles['input-box']}>
                <input
                  id="first_option"
                  name={firstOptionKey}
                  type="text"
                  className={
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }
                  value={
                    isSubmittedMode
                      ? questionForm?.[firstOptionKey]
                      : questionFormInTarotModal?.[firstOptionKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[firstOptionKey]?.length === 0
                        ? t('question.omitted')
                        : questionForm?.[PK.r2] === 304
                        ? t(`question.third_option_instruction1`)
                        : t(`question.first_option_instruction`)
                      : questionForm?.[PK.r2] === 304
                      ? t(`question.third_option_instruction1`)
                      : t(`question.first_option_instruction`)
                  }
                  onChange={e => {
                    if (e.target.value.length <= 100) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              </div>
            </div>
            <div className={styles['input-box-object']}>
              <div
                className={`${styles['label-box']} ${
                  browserLanguage === 'ja'
                    ? fontStyles['japanese-font-label']
                    : fontStyles['korean-font-label']
                }`}
              >
                <label
                  className={styles['object-label']}
                  htmlFor={secondOptionKey}
                >
                  {t(`question.second_option`)}
                </label>{' '}
                <InstructionButton
                  onClick={e => {
                    setInstructionOpen(prev => !prev);
                    setQuestionKind(8);
                  }}
                ></InstructionButton>
              </div>
              <div className={styles['input-box']}>
                <input
                  id="second_option"
                  name={secondOptionKey}
                  type="text"
                  className={
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-input']
                      : fontStyles['korean-font-input']
                  }
                  value={
                    isSubmittedMode
                      ? questionForm?.[secondOptionKey]
                      : questionFormInTarotModal?.[secondOptionKey]
                  }
                  placeholder={
                    isSubmittedMode
                      ? questionForm?.[secondOptionKey]?.length === 0
                        ? t('question.omitted')
                        : questionForm?.[PK.r2] === 304
                        ? t(`question.third_option_instruction2`)
                        : t(`question.second_option_instruction`)
                      : questionForm?.[PK.r2] === 304
                      ? t(`question.third_option_instruction2`)
                      : t(`question.second_option_instruction`)
                  }
                  onChange={e => {
                    if (e.target.value.length <= 100) {
                      handleQuestionFormInTarotModal(e);
                    }
                  }}
                  autoComplete="off"
                  readOnly={isSubmittedMode}
                />
              </div>
            </div>
            {questionForm?.[PK.r2] === 304 && (
              <div className={styles['input-box-object']}>
                <div
                  className={`${styles['label-box']} ${
                    browserLanguage === 'ja'
                      ? fontStyles['japanese-font-label']
                      : fontStyles['korean-font-label']
                  }`}
                >
                  <label
                    className={styles['object-label']}
                    htmlFor={thirdOptionKey}
                  >
                    {t(`question.third_option`)}
                  </label>{' '}
                  <InstructionButton
                    onClick={e => {
                      setInstructionOpen(prev => !prev);
                      setQuestionKind(9);
                    }}
                  ></InstructionButton>
                </div>
                <div className={styles['input-box']}>
                  <input
                    id="third_option"
                    name={thirdOptionKey}
                    type="text"
                    className={
                      browserLanguage === 'ja'
                        ? fontStyles['japanese-font-input']
                        : fontStyles['korean-font-input']
                    }
                    value={
                      isSubmittedMode
                        ? questionForm?.[thirdOptionKey]
                        : questionFormInTarotModal?.[thirdOptionKey]
                    }
                    placeholder={
                      isSubmittedMode
                        ? questionForm?.[thirdOptionKey]?.length === 0
                          ? t('question.omitted')
                          : questionForm?.[PK.r2] === 304
                          ? t(`question.third_option_instruction3`)
                          : t(`question.third_option_instruction3`)
                        : t(`question.third_option_instruction3`)
                    }
                    onChange={e => {
                      if (e.target.value.length <= 100) {
                        handleQuestionFormInTarotModal(e);
                      }
                    }}
                    autoComplete="off"
                    readOnly={isSubmittedMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
