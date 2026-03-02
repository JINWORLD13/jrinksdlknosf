/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import styles from './SettingsForm.module.scss';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/hooks';
import { Capacitor } from '@capacitor/core';
import {
  isDailyFortuneNotificationEnabled,
  setDailyFortuneNotificationEnabled,
} from '../../../services/dailyFortuneNotificationService.js';

const isNative = Capacitor.isNativePlatform();

const SettingsForm = () => {
  const { t } = useTranslation();
  const browserLanguage = useLanguageChange();

  const [dailyFortuneNotificationOn, setDailyFortuneNotificationOn] =
    useState(false);
  const [notificationSettingLoading, setNotificationSettingLoading] =
    useState(false);

  useEffect(() => {
    if (!isNative) return;
    let cancelled = false;
    (async () => {
      try {
        const on = await isDailyFortuneNotificationEnabled();
        if (!cancelled) setDailyFortuneNotificationOn(on);
      } catch (e) {
        console.error('[SettingsForm] daily fortune notification load:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDailyFortuneNotificationToggle = async (checked) => {
    if (!isNative || notificationSettingLoading) return;
    setNotificationSettingLoading(true);
    try {
      const title = t('daily-tarot.card');
      const body = t('mypage.daily-fortune-notification-desc');
      await setDailyFortuneNotificationEnabled(checked, { title, body });
      setDailyFortuneNotificationOn(checked);
    } catch (e) {
      console.error('[SettingsForm] daily fortune notification toggle:', e);
    } finally {
      setNotificationSettingLoading(false);
    }
  };

  return (
    <div
      className={`${styles['settings-container']} ${
        browserLanguage === 'ja'
          ? styles['settings-container-japanese']
          : ''
      }`}
    >
      <section className={styles['settings-section']} aria-label={t('more.settings')}>
        <div className={`${styles['settings-card']} ${!isNative ? styles['settings-card-web'] : ''}`}>
          <div className={styles['notification-row']}>
            <div className={styles['notification-content']}>
              <h2 className={styles['notification-title']}>
                {t('mypage.daily-fortune-notification')}
              </h2>
              <p className={styles['notification-desc']}>
                {t('mypage.daily-fortune-notification-desc')}
              </p>
              {!isNative && (
                <p className={styles['notification-web-hint']}>
                  {t('mypage.daily-fortune-notification-web-hint')}
                </p>
              )}
            </div>
            {isNative && (
              <label className={styles['notification-switch-wrap']}>
                <input
                  type="checkbox"
                  className={styles['notification-switch']}
                  checked={dailyFortuneNotificationOn}
                  disabled={notificationSettingLoading}
                  onChange={(e) =>
                    handleDailyFortuneNotificationToggle(e.target.checked)
                  }
                  aria-label={t('mypage.daily-fortune-notification')}
                />
              </label>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default SettingsForm;
