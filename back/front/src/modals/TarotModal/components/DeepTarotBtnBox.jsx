import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTotalCardsNumber } from '@/hooks';
import { useLanguageChange } from '@/hooks';
import Button from '../../../components/common/Button';
import CancelButton from '../../../components/common/CancelButton';
import { HistoryButton } from '../../../components/common/HistoryButton';
import fontStyles from '../../../styles/scss/Font.module.scss';
import {
  createEmptyQuestionForm,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

export const DeepTarotBtnBox = ({
  styles,
  stateGroup,
  setStateGroup,
  toggleModalGroup,
  handleStateGroup,
  questionFormInTarotModal,
  isPending,
  isInstructionOpen,
  setInstructionOpen,
  onHistoryButtonClick,
  ...props
}) => {
  const { t } = useTranslation();
  const {
    answerForm,
    cardForm,
    questionForm,
    modalForm,
    selectedTarotMode,
    isCSSInvisible,
    country,
    isQuestionOverLimit,
    ...rest
  } = stateGroup;

  const {
    updateAnswerForm,
    updateCardForm,
    updateQuestionForm,
    updateModalForm,
    setSelectedTarotMode,
    setIsCSSInvisible,
    updateCountry,
    updateTarotManualModalOpen,
    setFilledInTheQuestion,
    setQuestionOverLimit,
    ...rest2
  } = setStateGroup;

  const { toggleSpreadModal, toggleTarotModal } = toggleModalGroup;
  const {
    handleAnsweredState,
    handleCardForm,
    handleQuestionForm,
    handleResetAll,
    handleResetDeck,
    handleSpreadValue,
    handleReadyToShuffleValue,
    handleSuffleFinishValue,
    handleSelectedTarotMode,
    ...rest3
  } = handleStateGroup;
  const totalCardsNumber = useTotalCardsNumber();
  const browserLanguage = useLanguageChange();

  return (
    <div className={styles['btn-box']}>
      <div className={styles['theme-example']} style={{ flexGrow: 1 }}></div>
      <div
        className={`${styles['theme-example']} ${
          browserLanguage === 'ja'
            ? fontStyles['japanese-font-label']
            : fontStyles['korean-font-label']
        }`}
      >
        <p>
          {t(`question.theme`)}
          {t(`question.theme-description`)}
        </p>
      </div>
      <div className={styles['theme-example']} style={{ flexGrow: 1 }}></div>
      {answerForm?.isSubmitted === false && onHistoryButtonClick && (
        <HistoryButton
          onClick={onHistoryButtonClick}
          className={`${
            browserLanguage === 'ja' ? styles['btn-japanese'] : styles['btn']
          }`}
        />
      )}
      {answerForm?.isSubmitted === false && (
        <Button
          className={`${
            answerForm?.isSubmitted === false
              ? browserLanguage === 'ja'
                ? styles['btn-japanese']
                : styles['btn']
              : ''
          } `}
          onClick={() => {
            setIsCSSInvisible(true);
            //& 메뉴얼 모달창 띄우기
            updateTarotManualModalOpen(true);
            if (isInstructionOpen) setInstructionOpen(false);
          }}
        >
          {t(`button.tarot-manual`)}
        </Button>
      )}
      {answerForm?.isSubmitted === false && (
        <Button
          className={`${
            answerForm?.isSubmitted === false
              ? browserLanguage === 'ja'
                ? styles['btn-japanese']
                : styles['btn']
              : ''
          } `}
          onClick={() => {
            // if(isPending) return;
            if (questionFormInTarotModal?.question?.trim()?.length <= 0) {
              setFilledInTheQuestion(false);
              return;
            } else if (questionFormInTarotModal?.question?.trim()?.length > 0) {
              setFilledInTheQuestion(true);
            }
            if (questionForm?.[PK.r2] === 201) {
              // 201번 스프레드시트인 경우(양자택일)
              if (
                (browserLanguage === 'en' &&
                  questionForm['question']?.length > 1100) ||
                ((browserLanguage === 'ko' || browserLanguage === 'ja') &&
                  questionForm['question']?.length > 700)
              ) {
                setQuestionOverLimit(true);
                return;
              }
            } else {
              // 201번이 아닌 경우
              if (
                (browserLanguage === 'en' &&
                  questionForm['question']?.length > 600) ||
                ((browserLanguage === 'ko' || browserLanguage === 'ja') &&
                  questionForm['question']?.length > 400)
              ) {
                setQuestionOverLimit(true);
                return;
              }
            }
            setIsCSSInvisible(true);
            updateAnswerForm(prev => {
              return { ...prev, isSubmitted: true };
            });
            updateQuestionForm(prev => {
              return {
                ...prev,
                [PK.q0]: questionFormInTarotModal?.[PK.q0]?.trim(),
                [PK.q1]: questionFormInTarotModal?.[PK.q1]?.trim(),
                [PK.q2]: questionFormInTarotModal?.[PK.q2]?.trim(),
                [PK.q3]: questionFormInTarotModal?.[PK.q3]?.trim(),
                [PK.q4]: questionFormInTarotModal?.[PK.q4]?.trim(),
                [PK.q5]: questionFormInTarotModal?.[PK.q5]?.trim(),
                [PK.q6]: questionFormInTarotModal?.[PK.q6]?.trim(),
                [PK.q7]: questionFormInTarotModal?.[PK.q7]?.trim(),
                [PK.o0]: questionFormInTarotModal?.[PK.o0]?.trim(),
                [PK.o1]: questionFormInTarotModal?.[PK.o1]?.trim(),
                [PK.o2]: questionFormInTarotModal?.[PK.o2]?.trim(),
              };
            });
          }}
          autoFocus={true}
        >
          {t(`button.submit`)}
        </Button>
      )}
      {answerForm?.isSubmitted === true && (
        <Button
          className={`${
            answerForm?.isSubmitted && !cardForm.spread
              ? browserLanguage === 'ja'
                ? styles['btn-japanese']
                : styles['btn']
              : styles['none']
          }`}
          onClick={() => {
            handleReadyToShuffleValue(true);
            // handleSpreadValue(true);
            setIsCSSInvisible(true);
            if (isInstructionOpen) setInstructionOpen(false);
          }}
          autoFocus={true}
        >
          {t(`button.shuffle`)}
        </Button>
      )}
      {answerForm?.isSubmitted === true && (
        <Button
          className={`${
            answerForm?.isSubmitted && !cardForm.spread
              ? browserLanguage === 'ja'
                ? styles['btn-japanese']
                : styles['btn']
              : styles['none']
          }`}
          onClick={() => {
            setIsCSSInvisible(false);
            updateAnswerForm(prev => {
              return { ...prev, isSubmitted: false };
            });
          }}
        >
          {t(`button.rewrite`)}
        </Button>
      )}
      <CancelButton
        className={`${
          !answerForm?.isSubmitted
            ? browserLanguage === 'ja'
              ? styles['btn-japanese']
              : styles['btn']
            : `${
                !cardForm.spread
                  ? browserLanguage === 'ja'
                    ? styles['btn-japanese']
                    : styles['btn']
                  : styles['none']
              }`
        }`}
        onClick={(e = null) => {
          toggleTarotModal(
            false,
            questionForm?.[PK.r2],
            questionForm?.[PK.r0],
            totalCardsNumber
          );
          setIsCSSInvisible(false);
          updateTarotManualModalOpen(false);
          updateAnswerForm(prev => {
            return { ...prev, isSubmitted: false };
          });
          updateQuestionForm(createEmptyQuestionForm());
          if (isInstructionOpen) setInstructionOpen(false);
        }}
      >
        {t(`button.cancel`)}
      </CancelButton>
    </div>
  );
};
