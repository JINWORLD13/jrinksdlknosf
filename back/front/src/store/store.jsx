import { configureStore } from '@reduxjs/toolkit';
import tarotCard from './tarotCardStore.jsx';
import booleanStore from './booleanStore.jsx';
import userInfoStore from './userInfoStore.jsx';
import tarotHistoryStore from './tarotHistoryStore.jsx';

// ⭐ 새로운 함수: 매번 새로운 store 생성
export function createStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      tarotCard: tarotCard.reducer,
      booleanStore: booleanStore.reducer,
      userInfoStore: userInfoStore.reducer,
      tarotHistoryStore: tarotHistoryStore.reducer,
    },
    preloadedState, // 초기 데이터 설정 가능
  });
}

// ⭐ 클라이언트용 기본 store (기존 코드와 호환)
const store = createStore();
export default store;