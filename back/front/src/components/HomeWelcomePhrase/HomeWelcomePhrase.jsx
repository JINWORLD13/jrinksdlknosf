import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HomeWelcomePhrase.module.scss';
import { getNextWelcomePhrase } from '@/data/homeWelcomePhrases';

const DISPLAY_MS = 2500;
const FADE_IN_MS = 400;
const FADE_OUT_MS = 500;

const HomeWelcomePhrase = ({ onDone, startTimerWhen = true }) => {
  const { i18n } = useTranslation();
  const [phase, setPhase] = useState('enter'); // 'enter' | 'visible' | 'exit'
  const phrase = useMemo(
    () => getNextWelcomePhrase(i18n.language),
    [i18n.language]
  );

  useEffect(() => {
    if (!startTimerWhen) return;
    setPhase('visible');
    const tExit = setTimeout(() => setPhase('exit'), DISPLAY_MS);
    const tDone = setTimeout(() => {
      onDone?.();
    }, DISPLAY_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, [onDone, startTimerWhen]);

  const lang = (i18n.language || '').toLowerCase().split('-')[0] || 'ko';
  const isVisible = startTimerWhen ? phase === 'visible' : true;

  return (
    <div
      className={styles.overlay}
      data-phase={isVisible ? 'visible' : phase}
      data-lang={lang}
      aria-live="polite"
      aria-label={phrase}
    >
      <p className={styles.phrase}>{phrase}</p>
    </div>
  );
};

export default HomeWelcomePhrase;
