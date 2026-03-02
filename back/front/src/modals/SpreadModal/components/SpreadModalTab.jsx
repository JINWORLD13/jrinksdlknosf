import React from 'react';
import { useTranslation } from 'react-i18next';

export const SpreadModalTab = ({
  styles,
  selectedTarotMode,
  handleSelectedTarotMode,
  toggleTarotModal,
  updateAnswerForm,
  setWatchedAd,
  browserLanguage,
  isAdditionalQuestionMode,
  setSpeedTarotUnavailable,
  ...propd
}) => {
  const { t } = useTranslation();
  //! isVoucherModeOn 바꾸는 건 따로 안해주니 한번 설정하면 보통 모드 이외에서도 무료모드임. 외부에서 selectedTarotMode랑 신경써주거나 처음부터 isVoucherModeOn을 위치타로별로 상태관리 해야 했음.
  const isSpeedTarotDisabled = isAdditionalQuestionMode === true;

  return (
    <div className={styles['btn-box']}>
      <button
        className={`${
          browserLanguage === 'ja'
            ? styles['which-tarot-btn-japanese']
            : styles['which-tarot-btn']
        } ${selectedTarotMode === 1 ? styles['selected'] : null} ${
          isSpeedTarotDisabled ? styles['disabled'] : null
        }`}
        disabled={isSpeedTarotDisabled}
        onClick={() => {
          if (isSpeedTarotDisabled) {
            // blink 모달 표시
            if (setSpeedTarotUnavailable) {
              setSpeedTarotUnavailable(true);
            }
            return;
          }
          handleSelectedTarotMode(1);
          //! 안정적인 흐름을 위해 추가
          setWatchedAd(false);
          updateAnswerForm(prev => {
            return {
              ...prev,
              isSubmitted: false,
              isWaiting: false,
              isAnswered: false,
            };
          });
          toggleTarotModal(false, '', '', '');
        }}
      >
        {t(`tab.speed_tarot`)}
      </button>
      <button
        className={`${
          browserLanguage === 'ja'
            ? styles['which-tarot-btn-japanese']
            : styles['which-tarot-btn']
        } ${selectedTarotMode === 2 ? styles['selected'] : null}`}
        onClick={() => {
          handleSelectedTarotMode(2);
          //! 안정적인 흐름을 위해 추가
          setWatchedAd(false);
          updateAnswerForm(prev => {
            return {
              ...prev,
              isSubmitted: false,
              isWaiting: false,
              isAnswered: false,
            };
          });
          toggleTarotModal(false, '', '', '');
        }}
      >
        {t(`tab.normal_question_tarot`)}
      </button>
      <button
        className={`${
          browserLanguage === 'ja'
            ? styles['which-tarot-btn-japanese']
            : styles['which-tarot-btn']
        } ${selectedTarotMode === 3 ? styles['selected'] : null}`}
        onClick={() => {
          handleSelectedTarotMode(3);
          //! 안정적인 흐름을 위해 추가
          setWatchedAd(false);
          updateAnswerForm(prev => {
            return {
              ...prev,
              isSubmitted: false,
              isWaiting: false,
              isAnswered: false,
            };
          });
          toggleTarotModal(false, '', '', '');
        }}
      >
        {t(`tab.deep_question_tarot`)}
      </button>
      <button
        className={`${
          browserLanguage === 'ja'
            ? styles['which-tarot-btn-japanese']
            : styles['which-tarot-btn']
        } ${selectedTarotMode === 4 ? styles['selected'] : null}`}
        onClick={() => {
          handleSelectedTarotMode(4);
          //! 안정적인 흐름을 위해 추가
          setWatchedAd(false);
          updateAnswerForm(prev => {
            return {
              ...prev,
              isSubmitted: false,
              isWaiting: false,
              isAnswered: false,
            };
          });
          toggleTarotModal(false, '', '', '');
        }}
      >
        {t(`tab.serious_question_tarot`)}
      </button>
    </div>
  );
};
