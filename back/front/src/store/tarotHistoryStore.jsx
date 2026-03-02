import { createSlice } from '@reduxjs/toolkit';

//Redux Toolkit의 createSlice를 사용할 때, reducer 함수는 새로운 상태(state)를 반환해야 하지만, return action.payload.tarotHistory;처럼 하면 액션 페이로드 자체를 반환하게 됨. 틀린 문법.
let tarotHistoryStore = createSlice({
  name: 'tarotHistoryStore',
  initialState: { tarotHistory : [] },
  reducers: {
    setTarotHistoryAction(state, action) {
      state.tarotHistory = action.payload;
    },
  },
});

export let { setTarotHistoryAction } = tarotHistoryStore.actions;

export default tarotHistoryStore;