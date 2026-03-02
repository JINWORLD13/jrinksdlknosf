import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

// 음악 볼륨 저장
export const saveMusicVolume = async volume => {
  try {
    if (isNative) {
      await Preferences.set({
        key: 'musicVolume',
        value: volume.toString(),
      });
    } else {
      localStorage.setItem('musicVolume', volume.toString());
    }
  } catch (error) {
    console.error('Failed to save music volume:', error);
  }
};

// 음악 볼륨 불러오기
export const getMusicVolume = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: 'musicVolume' });
      return value ? parseFloat(value) : 0.5; // 기본값 0.5 (50%)
    } else {
      const volume = localStorage.getItem('musicVolume');
      return volume ? parseFloat(volume) : 0.5; // 기본값 0.5 (50%)
    }
  } catch (error) {
    console.error('Failed to get music volume:', error);
    return 0.5; // 에러 시 기본값
  }
};

// 음악 재생 상태 저장
export const saveMusicPlayingState = async isPlaying => {
  try {
    if (isNative) {
      await Preferences.set({
        key: 'isMusicPlaying',
        value: isPlaying.toString(),
      });
    } else {
      localStorage.setItem('isMusicPlaying', isPlaying.toString());
    }
  } catch (error) {
    console.error('Failed to save music playing state:', error);
  }
};

// 음악 재생 상태 불러오기
export const getMusicPlayingState = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: 'isMusicPlaying' });
      // 저장된 값이 없으면 true 반환 (기본값: 켜짐)
      return value !== null ? value === 'true' : true;
    } else {
      const isPlaying = localStorage.getItem('isMusicPlaying');
      // 저장된 값이 없으면 true 반환 (기본값: 켜짐)
      return isPlaying !== null ? isPlaying === 'true' : true;
    }
  } catch (error) {
    console.error('Failed to get music playing state:', error);
    return true; // 에러 시 true (켜짐)
  }
};

// 음악 소스 저장
export const saveMusicSource = async source => {
  try {
    if (isNative) {
      await Preferences.set({
        key: 'musicSource',
        value: source || '',
      });
    } else {
      localStorage.setItem('musicSource', source || '');
    }
  } catch (error) {
    console.error('Failed to save music source:', error);
  }
};

// 음악 소스 불러오기
export const getMusicSource = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: 'musicSource' });
      return value || null;
    } else {
      const source = localStorage.getItem('musicSource');
      return source || null;
    }
  } catch (error) {
    console.error('Failed to get music source:', error);
    return null;
  }
};
