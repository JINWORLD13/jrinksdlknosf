import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import fontStyles from '../../../styles/scss/Font.module.scss';

export const ThemeBox = ({ styles, isSubmittedMode, ...props }) => {
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();
  return (
    <div
      className={`${
        isSubmittedMode ? styles['submitted-box'] : styles['question-box']
      }`}
    >
      <div className={styles['select-container']}>
        <div
          className={`${styles['label-box']} ${
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-label']
              : fontStyles['korean-font-label']
          }`}
        >
          <label htmlFor="theme">{t(`question.theme`)}</label>{' '}
          {/* <InstructionButton
              onClick={e => {
                setInstructionOpen(prev => !prev);
                setQuestionKind(0)
              }}
            ></InstructionButton> */}
        </div>
        <div
          className={`${styles['select-box']} ${
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-label']
              : fontStyles['korean-font-label']
          }`}
        >
          {t(`question.theme-description`)}
          {/* <select
            id="theme"
            name="theme"
            value={questionFormInTarotModal['theme']}
            onChange={e => {
              handleQuestionFormInTarotModal(e);
            }}
          >
            <option value="">{t(`question.category`)}</option>
            <option value={t(`question.inner_feelings`)}>
              {t(`question.inner_feelings`)}
            </option>
            <option value={t(`question.love`)}>{t(`question.love`)}</option>
            <option value={t(`question.human_relationships`)}>
              {t(`question.human_relationships`)}
            </option>
            <option value={t(`question.finance`)}>
              {t(`question.finance`)}
            </option>
            <option value={t(`question.occupation`)}>
              {t(`question.occupation`)}
            </option>
            <option value={t(`question.career`)}>
              {t(`question.career`)}
            </option>
            <option value={t(`question.decision_making`)}>
              {t(`question.decision_making`)}
            </option>
          </select> */}
        </div>
      </div>
    </div>
  );
};
