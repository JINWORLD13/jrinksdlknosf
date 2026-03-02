import { useState } from 'react';
import {
  createEmptyQuestionData,
  createEmptyReadingConfig,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

// 답변 상태의 기본 구조도 추상화 헬퍼를 사용해 공개 소스에서 스키마 의도를 직접 노출하지 않는다.
// 回答状態の初期構造も抽象化ヘルパーを使い、公開ソースでスキーマ意図を直接露出しない。
// The answer-state defaults also rely on abstract helpers so schema intent is not directly exposed in public source.
// Define initial state outside the hook for better performance and reusability
// initialState를 hook 외부에 정의하여 불필요한 재생성을 방지
const initialState = {
  questionData: createEmptyQuestionData(),
  readingConfig: createEmptyReadingConfig(),
  // 추가질문 누적 카드 정보 (원본 + 이전 추가질문 + 자기 카드들)
  combinedReadingConfig: {
    [PK.c0]: [],
  },
  answer: '',
  language: '',
  timeOfCounselling: '',
  createdAt: '',
  updatedAt: '',
  isSubmitted: false,
  isWaiting: false,
  isAnswered: false,
  additionalQuestionCount: 0,
  hasAdditionalQuestion: false,
  originalTarotId: null,
  parentTarotId: null,
  tarotIdChain: [],
  questionChain: [],
};

/**
 * Custom hook to manage answer form state
 * @param {Object} inputState - Initial state to override default values
 * @returns {[Object, Function]} - Current state and state update function
 */
const useAnswerFormState = (inputState = null) => {
  // Validate input state and merge with default state
  const getInitialState = () => {
    if (!inputState || typeof inputState !== 'object') {
      return initialState;
    }
    return {
      ...initialState,
      ...inputState,
    };
  };

  const [answerForm, setAnswerForm] = useState(getInitialState());

  // Wrapper function for setState to ensure type safety
  const updateAnswerForm = newState => {
    if (typeof newState === 'function') {
      setAnswerForm(prevState => ({
        ...initialState,
        ...prevState,
        ...newState(prevState),
      }));
    } else {
      setAnswerForm(prevState => ({
        ...initialState,
        ...prevState,
        ...newState,
      }));
    }
  };

  return [answerForm, updateAnswerForm];
};

export default useAnswerFormState;
