/**
 * 오늘의 운세 로컬 알림 서비스 (Capacitor)
 * - 네이티브 앱에서만 동작. 매일 로컬 시간 오전 8시에 알림.
 */
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const PREF_KEY = 'dailyFortuneNotificationEnabled';
const DAILY_FORTUNE_NOTIFICATION_ID = 1;
const CHANNEL_ID = 'daily-fortune';
const HOUR_8_AM = 8;
const MINUTE_0 = 0;

const isNative = () => Capacitor.isNativePlatform();

/**
 * @returns {Promise<boolean>} 알림 사용 여부
 */
export async function isDailyFortuneNotificationEnabled() {
  if (!isNative()) return false;
  try {
    const { value } = await Preferences.get({ key: PREF_KEY });
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * 알림 on/off 저장 및 스케줄 반영
 * @param {boolean} enabled
 * @param {{ title?: string, body?: string }} [options] 알림 문구 (i18n 적용 시 전달)
 */
export async function setDailyFortuneNotificationEnabled(enabled, options = {}) {
  if (!isNative()) return;
  try {
    await Preferences.set({
      key: PREF_KEY,
      value: enabled ? 'true' : 'false',
    });
    if (enabled) {
      await scheduleDailyFortuneNotification(options);
    } else {
      await cancelDailyFortuneNotification();
    }
  } catch (e) {
    console.error('[dailyFortuneNotification] setEnabled error:', e);
  }
}

/**
 * 앱 시작 시 호출. 설정이 켜져 있으면 스케줄 복구(재등록).
 * @param {{ title?: string, body?: string }} [options]
 */
export async function restoreDailyFortuneSchedule(options = {}) {
  if (!isNative()) return;
  try {
    const enabled = await isDailyFortuneNotificationEnabled();
    if (enabled) await scheduleDailyFortuneNotification(options);
  } catch (e) {
    console.error('[dailyFortuneNotification] restoreSchedule error:', e);
  }
}

/**
 * 권한 요청
 * Android에서 checkPermissions()가 CapacitorPlugins 스레드에서 Activity null로 NPE를 일으키는
 * 이슈가 있어, checkPermissions() 없이 requestPermissions()만 호출합니다.
 * @returns {Promise<boolean>} 권한 허용 여부
 */
export async function requestNotificationPermissions() {
  if (!isNative()) return false;
  try {
    const { LocalNotifications } = await import(
      /* @vite-ignore */ '@capacitor/local-notifications'
    );
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch (e) {
    console.error('[dailyFortuneNotification] requestPermissions error:', e);
    return false;
  }
}

/**
 * Android 채널 생성 (오늘의 운세용)
 */
async function ensureChannel(options = {}) {
  try {
    const { LocalNotifications } = await import(
      /* @vite-ignore */ '@capacitor/local-notifications'
    );
    const name = options.channelName || '오늘의 운세';
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name,
      importance: 4,
      visibility: 1,
      description: '매일 오전 8시 오늘의 운세 알림',
    });
  } catch (e) {
    console.error('[dailyFortuneNotification] ensureChannel error:', e);
  }
}

/**
 * 매일 오전 8시(로컬 시간) 알림 스케줄
 * @param {{ title?: string, body?: string, channelName?: string }} [options]
 */
export async function scheduleDailyFortuneNotification(options = {}) {
  if (!isNative()) return;
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;

    await ensureChannel(options);

    const { LocalNotifications } = await import(
      /* @vite-ignore */ '@capacitor/local-notifications'
    );

    const title = options.title ?? '오늘의 운세';
    const body = options.body ?? '오늘의 운세를 확인해 보세요 ✨';

    // 기존 동일 id 알림 제거 후 재등록
    await LocalNotifications.cancel({
      notifications: [{ id: DAILY_FORTUNE_NOTIFICATION_ID }],
    });

    // 매일 오전 8시 (로컬) - on + every 사용
    await LocalNotifications.schedule({
      notifications: [
        {
          id: DAILY_FORTUNE_NOTIFICATION_ID,
          title,
          body,
          channelId: CHANNEL_ID,
          schedule: {
            on: { hour: HOUR_8_AM, minute: MINUTE_0 },
            every: 'day',
            allowWhileIdle: true,
          },
        },
      ],
    });
  } catch (e) {
    console.error('[dailyFortuneNotification] schedule error:', e);
  }
}

/**
 * 오늘의 운세 알림 취소
 */
export async function cancelDailyFortuneNotification() {
  if (!isNative()) return;
  try {
    const { LocalNotifications } = await import(
      /* @vite-ignore */ '@capacitor/local-notifications'
    );
    await LocalNotifications.cancel({
      notifications: [{ id: DAILY_FORTUNE_NOTIFICATION_ID }],
    });
  } catch (e) {
    console.error('[dailyFortuneNotification] cancel error:', e);
  }
}
