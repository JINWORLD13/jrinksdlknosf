import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { localizeTimeZone } from '@/utils/format/localizeTimeZone';
import {
  createQuestionHistoryPayload,
  getPayloadKeys,
} from '@/lib/tarot/payload/payloadCodec';

const PK = getPayloadKeys();

const isNative = Capacitor.isNativePlatform();
const STORAGE_KEY_PREFIX = 'questionHistory';
const MAX_HISTORY_COUNT = 10;

// 히스토리 저장 payload도 헬퍼로 만들고, 공개 코드에 내부 스키마 키를 직접 쓰지 않도록 유지한다.
// 履歴保存 payload もヘルパーで生成し、公開コードに内部スキーマキーを直接書かないようにする。
// History payloads are also built through helpers so internal schema keys are not written directly in public source.
// 사용자별 스토리지 키 생성
const getUserStorageKey = userId => {
  if (!userId) return STORAGE_KEY_PREFIX; // userId가 없으면 기본 키 사용 (하위 호환성)
  return `${STORAGE_KEY_PREFIX}_${userId}`;
};

// 질문 세트 저장
export const saveQuestionSet = async (questionForm, userId) => {
  try {
    if (!questionForm || !questionForm?.[PK.q7]) {
      return; // 질문이 없으면 저장하지 않음
    }

    const questionSet = {
      id: Date.now().toString(), // 고유 ID
      ...createQuestionHistoryPayload({
        questionData: questionForm,
        readingConfig: questionForm,
        language: questionForm?.language || 'ko',
      }),
      date: new Date().toISOString(), // ISO 형식으로 저장
    };

    // 기존 히스토리 가져오기
    const existingHistory = await getQuestionSets(userId);

    // 완전히 동일한 질문 세트가 있는지 확인하고 제거 (중복 방지, 스프레드 제외)
    const filteredHistory = existingHistory.filter(item => {
      // 질문 관련 필드만 비교 (스프레드는 제외)
      return !(
        (item?.[PK.q7] || '').trim() === (questionForm?.[PK.q7] || '').trim() &&
        (item?.[PK.q0] || '') === (questionForm?.[PK.q0] || '') &&
        (item?.[PK.q1] || '') === (questionForm?.[PK.q1] || '') &&
        (item?.[PK.q2] || '') === (questionForm?.[PK.q2] || '') &&
        (item?.[PK.q3] || '') === (questionForm?.[PK.q3] || '') &&
        (item?.[PK.q4] || '') === (questionForm?.[PK.q4] || '') &&
        (item?.[PK.q5] || '') === (questionForm?.[PK.q5] || '') &&
        (item?.[PK.q6] || '') === (questionForm?.[PK.q6] || '') &&
        (item?.[PK.o0] || '') === (questionForm?.[PK.o0] || '') &&
        (item?.[PK.o1] || '') === (questionForm?.[PK.o1] || '') &&
        (item?.[PK.o2] || '') === (questionForm?.[PK.o2] || '')
      );
    });

    // 새로운 질문을 맨 앞에 추가 (완전히 동일한 질문이면 날짜가 업데이트되어 최상단으로)
    const updatedHistory = [questionSet, ...filteredHistory];

    // 최대 5개만 유지
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_COUNT);

    // 사용자별 키로 저장
    const storageKey = getUserStorageKey(userId);
    if (isNative) {
      await Preferences.set({
        key: storageKey,
        value: JSON.stringify(trimmedHistory),
      });
    } else {
      localStorage.setItem(storageKey, JSON.stringify(trimmedHistory));
    }
  } catch (error) {
    console.error('Failed to save question set:', error);
  }
};

// 질문 세트 목록 가져오기
export const getQuestionSets = async userId => {
  try {
    const storageKey = getUserStorageKey(userId);
    if (isNative) {
      const { value } = await Preferences.get({ key: storageKey });
      return value ? JSON.parse(value) : [];
    } else {
      const history = localStorage.getItem(storageKey);
      return history ? JSON.parse(history) : [];
    }
  } catch (error) {
    console.error('Failed to get question sets:', error);
    return [];
  }
};

// 특정 질문 세트 삭제
export const deleteQuestionSet = async (id, userId) => {
  try {
    const existingHistory = await getQuestionSets(userId);
    const filteredHistory = existingHistory.filter(item => item.id !== id);

    const storageKey = getUserStorageKey(userId);
    if (isNative) {
      await Preferences.set({
        key: storageKey,
        value: JSON.stringify(filteredHistory),
      });
    } else {
      localStorage.setItem(storageKey, JSON.stringify(filteredHistory));
    }
  } catch (error) {
    console.error('Failed to delete question set:', error);
  }
};

// 날짜 포맷팅 (실제 날짜 + 상대 시간)
export const formatQuestionDate = (dateString, browserLanguage = 'ko') => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // 실제 날짜와 시간 포맷팅
    let formattedDate;
    if (browserLanguage === 'ko') {
      const dateStr = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      formattedDate = `${dateStr} ${timeStr}`;
    } else if (browserLanguage === 'ja') {
      const dateStr = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('ja-JP', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      });
      formattedDate = `${dateStr} ${timeStr}時`;
    } else {
      // English
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      formattedDate = `${dateStr} ${timeStr}`;
    }

    // 상대 시간 계산
    let relativeTime;
    if (browserLanguage === 'ko') {
      if (diffMins < 1) relativeTime = '방금 전';
      else if (diffMins < 60) relativeTime = `${diffMins}분 전`;
      else if (diffHours < 24) relativeTime = `${diffHours}시간 전`;
      else if (diffDays < 7) relativeTime = `${diffDays}일 전`;
      else if (diffDays < 30) relativeTime = `${Math.floor(diffDays / 7)}주 전`;
      else if (diffDays < 365)
        relativeTime = `${Math.floor(diffDays / 30)}개월 전`;
      else relativeTime = `${Math.floor(diffDays / 365)}년 전`;
    } else if (browserLanguage === 'ja') {
      if (diffMins < 1) relativeTime = 'たった今';
      else if (diffMins < 60) relativeTime = `${diffMins}分前`;
      else if (diffHours < 24) relativeTime = `${diffHours}時間前`;
      else if (diffDays < 7) relativeTime = `${diffDays}日前`;
      else if (diffDays < 30)
        relativeTime = `${Math.floor(diffDays / 7)}週間前`;
      else if (diffDays < 365)
        relativeTime = `${Math.floor(diffDays / 30)}ヶ月前`;
      else relativeTime = `${Math.floor(diffDays / 365)}年前`;
    } else {
      // English
      if (diffMins < 1) relativeTime = 'Just now';
      else if (diffMins < 60) relativeTime = `${diffMins} min ago`;
      else if (diffHours < 24)
        relativeTime = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      else if (diffDays < 7)
        relativeTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffDays < 30)
        relativeTime = `${Math.floor(diffDays / 7)} week${
          Math.floor(diffDays / 7) > 1 ? 's' : ''
        } ago`;
      else if (diffDays < 365)
        relativeTime = `${Math.floor(diffDays / 30)} month${
          Math.floor(diffDays / 30) > 1 ? 's' : ''
        } ago`;
      else
        relativeTime = `${Math.floor(diffDays / 365)} year${
          Math.floor(diffDays / 365) > 1 ? 's' : ''
        } ago`;
    }

    // 사용자의 시간대 정보 가져오기
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneLabel = localizeTimeZone(browserLanguage, userTimeZone);

    // 실제 날짜, 시간, 시간대, 상대 시간을 함께 반환
    return `${formattedDate} ${timeZoneLabel} (${relativeTime})`;
  } catch (error) {
    console.error('Failed to format date:', error);
    return dateString;
  }
};
