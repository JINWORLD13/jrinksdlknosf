import { useState } from 'react';
import { createEmptyQuestionForm } from '@/lib/tarot/payload/payloadCodec';

// 초기 폼 구조도 헬퍼에서 생성해 공개 코드에 내부 키가 직접 드러나지 않도록 유지한다.
// 初期フォーム構造もヘルパーから生成し、公開コードに内部キーが直接現れないようにする。
// The initial form shape is generated from helpers so internal keys do not appear directly in public code.
// 초기 상태를 컴포넌트 외부에 정의하여 불필요한 재생성 방지
const initialState = {
  ...createEmptyQuestionForm(),
};

/**
 * Custom hook for managing question form state
 * @param {Object} inputState - Initial state to override default values
 * @returns {[Object, Function]} - Current state and state update function
 */
const useQuestionFormState = (inputState = null) => {
  // 초기 상태 설정 로직
  const getInitialState = () => {
    if (!inputState || typeof inputState !== 'object' || Object.keys(inputState)?.length === 0) {
      return initialState;
    }
    // 기본값과 입력값을 병합
    return {
      ...initialState,
      ...inputState
    };
  };

  const [questionForm, setQuestionForm] = useState(getInitialState());

  // 상태 업데이트 함수
  const updateQuestionForm = (newState) => {
    if (typeof newState === 'function') {
      // 함수형 업데이트를 지원
      setQuestionForm(prevState => ({
        ...initialState,
        ...prevState,
        ...newState(prevState)
      }));
    } else {
      // 객체 업데이트를 지원
      setQuestionForm(prevState => ({
        ...initialState,
        ...prevState,
        ...newState
      }));
    }
  };

  return [questionForm, updateQuestionForm];
};

export default useQuestionFormState;
