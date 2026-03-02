import { createSlice } from '@reduxjs/toolkit';

//Redux Toolkit의 createSlice를 사용할 때, reducer 함수는 새로운 상태(state)를 반환해야 하지만, return action.payload.isWaiting;와 return action.payload.isAnswered;처럼 하면 액션 페이로드 자체를 반환하게 됨. 틀린 문법.
let booleanStore = createSlice({
  name: 'booleanStore',
  initialState: {
    isWaiting: false,
    isAnswered: false,
    isDoneAnimationOfBackground: false,
    isReadyToShowDurumagi: false,
    isMusicPlaying: false, // App.jsx에서 로드 후 설정됨
    musicVolume: 0.5, // App.jsx에서 로드 후 설정됨 (기본값: 0.5 = 50%)
    musicSource: null, // null = Web Audio API, 또는 mp3 파일 경로, 또는 URL
  },
  reducers: {
    setIsWaiting(state, action) {
      state.isWaiting = action.payload;
    },
    setIsAnswered(state, action) {
      state.isAnswered = action.payload;
    },
    setIsDoneAnimationOfBackground(state, action) {
      state.isDoneAnimationOfBackground = action.payload;
    },
    setIsReadyToShowDurumagi(state, action) {
      state.isReadyToShowDurumagi = action.payload;
    },
    setIsMusicPlaying(state, action) {
      state.isMusicPlaying = action.payload;
    },
    setMusicVolume(state, action) {
      state.musicVolume = action.payload;
    },
    setMusicSource(state, action) {
      state.musicSource = action.payload;
    },
  },
});

export let {
  setIsWaiting,
  setIsAnswered,
  setIsDoneAnimationOfBackground,
  setIsReadyToShowDurumagi,
  setIsMusicPlaying,
  setMusicVolume,
  setMusicSource,
} = booleanStore.actions;

export default booleanStore;
