import { useState, useCallback } from 'react';
import {
  createEmptyQuestionData,
  createEmptyReadingConfig,
} from '@/lib/tarot/payload/payloadCodec';

// 제출 전 임시 상태도 추상화된 기본 구조를 사용해 공개 코드에서 키 의미 노출을 줄인다.
// 送信前の一時状態も抽象化された基本構造を使い、公開コードでキー意味の露出を減らす。
// The pre-submit temporary state also uses abstract defaults to reduce semantic key exposure in public code.
const useSubmitFormState = (inputState) => {
  // 함수로 값 초기화 또는 기본 값 사용 로직을 이동
  const getDefaultState = () => ({
    questionData: createEmptyQuestionData(),
    readingConfig: createEmptyReadingConfig(),
  });

  const initialState = inputState || getDefaultState();
  const [submitForm, setSubmitForm] = useState(initialState);

  const updateSubmitForm = useCallback((newSubmitForm) => {
    setSubmitForm(newSubmitForm);
  }, []);

  return [submitForm, updateSubmitForm];
};

export default useSubmitFormState;