import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

/**
 * Retrieves or generates a unique device ID for guest usage tracking.
 * @returns {Promise<string>} The device ID.
 */
export const getDeviceId = async () => {
  const DEVICE_ID_KEY = 'guest_device_id';

  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: DEVICE_ID_KEY });
      if (value) {
        return value;
      }
      const newId = uuidv4();
      await Preferences.set({ key: DEVICE_ID_KEY, value: newId });
      return newId;
    } else {
      const storedId = localStorage.getItem(DEVICE_ID_KEY);
      if (storedId) {
        return storedId;
      }
      const newId = uuidv4();
      localStorage.setItem(DEVICE_ID_KEY, newId);
      return newId;
    }
  } catch (error) {
    console.warn('Failed to get/set device ID:', error);
    // Fallback if storage fails
    return uuidv4();
  }
};
