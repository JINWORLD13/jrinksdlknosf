import React, { useEffect, useState, useMemo } from 'react';
import styles from './DailyTarotFortune.module.scss';
import fontStyles from '../../../styles/scss/Font.module.scss';
import { tarotDeck } from '../../../data/TarotCardDeck/TarotCardDeck';
import { useLanguageChange } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { getTodayCard } from '../../../utils/storage/tokenLocalStorage';
import { getTodayCardForNative } from '../../../utils/storage/tokenPreference';
import { Capacitor } from '@capacitor/core';
const isNative = Capacitor.isNativePlatform();

/** Valid suit keys for 오늘의 에너지. */
const SUIT_KEYS = ['major', 'wands', 'cups', 'swords', 'pentacles'];

/** card.index 0–21 major, 22–35 wands, 36–49 cups, 50–63 swords, 64–77 pentacles. */
function getSuitForEnergy(card) {
  if (!card) return 'major';
  if (card.suit && SUIT_KEYS.includes(card.suit)) return card.suit;
  const idx = typeof card.index === 'number' ? card.index : 0;
  if (idx <= 21) return 'major';
  if (idx <= 35) return 'wands';
  if (idx <= 49) return 'cups';
  if (idx <= 63) return 'swords';
  return 'pentacles';
}

/** 행운의 색: 슈트별 hex (major=골드, wands=빨강, cups=파랑, swords=회색, pentacles=초록). */
const SUIT_LUCKY_COLOR_HEX = {
  major: '#D4AF37',
  wands: '#E74C3C',
  cups: '#3498DB',
  swords: '#95A5A6',
  pentacles: '#27AE60',
};

              /** Court rank string → fortune number 11–14. */
const COURT_RANK_TO_NUMBER = { page: 11, knight: 12, queen: 13, king: 14 };

/**
 * 행운의 넘버: major 1–22, minor 숫자카드 1–10, 코트 11–14.
 */
function getFortuneNumber(card) {
  if (!card) return 1;
  if (card.suit === 'major') {
    const r = card.rank;
    return typeof r === 'number' && r >= 0 && r <= 21 ? r + 1 : 1;
  }
  const r = card.rank;
  if (typeof r === 'number' && r >= 1 && r <= 10) return r;
  if (typeof r === 'string' && COURT_RANK_TO_NUMBER[r] != null) {
    return COURT_RANK_TO_NUMBER[r];
  }
  return (card.index % 10) + 1 || 1;
}

/** Section config: titleKey, color, type 'list'|'keywords', maxItems, getContent(card, getLocalizedContent, t) -> array */
const SECTION_CONFIG = [
  {
    id: 'one-line',
    titleKey: 'daily-tarot.one-line',
    color: 'amber',
    type: 'list',
    maxItems: 1,
    getContent: (card, getLoc) => {
      const msg = getLoc(card.today_one_msg_en, card.today_one_msg_ko, card.today_one_msg_ja);
      return typeof msg === 'string' && msg.trim() ? [msg] : [];
    },
  },
  {
    id: 'energy',
    titleKey: 'daily-tarot.energy',
    color: 'blue',
    type: 'list',
    maxItems: 1,
    getContent: (card, _getLoc, t) => {
      const suit = getSuitForEnergy(card);
      return [t(`daily-tarot.suit-desc.${suit}`)];
    },
  },
  {
    id: 'message',
    titleKey: 'daily-tarot.message',
    color: 'purple',
    type: 'list',
    maxItems: undefined,
    getContent: null, // computed in useMemo (fortune_telling minus one-line)
  },
  {
    id: 'try-today',
    titleKey: 'daily-tarot.try-today',
    color: 'green',
    type: 'list',
    maxItems: 3,
    getContent: (card, getLoc) =>
      (getLoc(card.meanings.light, card.meanings.light_ko, card.meanings.light_ja) ?? []).slice(0, 3),
  },
  {
    id: 'watch-out',
    titleKey: 'daily-tarot.watch-out',
    color: 'red',
    type: 'list',
    maxItems: 3,
    getContent: (card, getLoc) =>
      (getLoc(card.meanings.shadow, card.meanings.shadow_ko, card.meanings.shadow_ja) ?? []).slice(0, 3),
  },
  {
    id: 'lucky-number',
    titleKey: 'daily-tarot.lucky-number',
    color: 'amber',
    type: 'list',
    maxItems: 1,
    getContent: (card) => {
      const num = getFortuneNumber(card);
      return [String(num)];
    },
  },
  {
    id: 'lucky-color',
    titleKey: 'daily-tarot.lucky-color',
    color: 'blue',
    type: 'list',
    maxItems: 1,
    getContent: (card, _getLoc, t) => {
      const suit = getSuitForEnergy(card);
      return [t(`daily-tarot.lucky-color-name.${suit}`)];
    },
  },
  {
    id: 'keyword',
    titleKey: 'daily-tarot.keyword',
    color: 'blue',
    type: 'keywords',
    getContent: (card, getLoc) =>
      getLoc(card.keywords, card.keywords_ko, card.keywords_ja) ?? [],
  },
];

const DailyTarotFortune = ({
  cardForm,
  userInfo,
  todayCardIndex,
  checkIfNewDay,
  ...props
}) => {
  const [todayCardIndexInLocalStorage, setTodayCardIndexInLocalStorage] =
    useState(() => {
      if (todayCardIndex !== null && todayCardIndex !== undefined) {
        return todayCardIndex;
      }
      if (!isNative) {
        const webCard = getTodayCard(userInfo);
        return webCard;
      }
      if (isNative) {
        return null;
      }
    });

  useEffect(() => {
    if (todayCardIndex !== null && todayCardIndex !== undefined) {
      setTodayCardIndexInLocalStorage(todayCardIndex);
    }
  }, [todayCardIndex]);

  useEffect(() => {
    const fetchTodayCard = async () => {
      try {
        if (checkIfNewDay) {
          const isNewDay = await checkIfNewDay(userInfo);
          if (isNewDay) {
            setTodayCardIndexInLocalStorage(null);
            return;
          }
        }

        let index;
        if (isNative) {
          index = await getTodayCardForNative(userInfo);
        } else {
          index = getTodayCard(userInfo);
        }

        if (index !== null && index !== undefined) {
          setTodayCardIndexInLocalStorage(index);
        }
      } catch (error) {
        // silent
      }
    };

    if (
      props?.from === 1 &&
      (todayCardIndex === null || todayCardIndex === undefined) &&
      (todayCardIndexInLocalStorage === null ||
        todayCardIndexInLocalStorage === undefined) &&
      userInfo?.email !== '' &&
      userInfo?.email !== undefined
    ) {
      fetchTodayCard();
    }
  }, [
    isNative,
    userInfo?.email,
    props?.from,
    todayCardIndexInLocalStorage,
    checkIfNewDay,
  ]);

  const selectedCard = tarotDeck[todayCardIndexInLocalStorage];
  const browserLanguage = useLanguageChange();
  const { t } = useTranslation();

  const getLocalizedContent = (en, ko, ja) => {
    switch (browserLanguage) {
      case 'ko':
        return ko;
      case 'ja':
        return ja;
      default:
        return en;
    }
  };

  const sectionData = useMemo(() => {
    if (!selectedCard) return [];
    const fortuneTelling =
      getLocalizedContent(
        selectedCard.fortune_telling,
        selectedCard.fortune_telling_ko,
        selectedCard.fortune_telling_ja
      ) ?? [];

    return SECTION_CONFIG.map((cfg) => {
      let content;
      if (cfg.id === 'message') {
        content = fortuneTelling;
      } else if (cfg.getContent) {
        content =
          cfg.type === 'keywords'
            ? cfg.getContent(selectedCard, getLocalizedContent, t)
            : (cfg.getContent(selectedCard, getLocalizedContent, t) ?? []).slice(
                0,
                cfg.maxItems ?? 999
              );
      } else {
        content = [];
      }
      const hex =
        cfg.id === 'lucky-color'
          ? SUIT_LUCKY_COLOR_HEX[getSuitForEnergy(selectedCard)]
          : undefined;
      return { ...cfg, content, hex };
    }).filter((s) => s.content?.length > 0);
  }, [selectedCard, todayCardIndexInLocalStorage, browserLanguage, t]);

  const Section = ({ title, content, color, description, hex }) => (
    <div className={`${styles.section} ${styles[color]}`}>
      <h3
        className={
          browserLanguage === 'ja'
            ? fontStyles['japanese-font-small-title']
            : fontStyles['korean-font-small-title']
        }
      >
        {title}
      </h3>
      {description && (
        <p
          className={`${styles.sectionDesc} ${
            browserLanguage === 'ja' ? '' : styles.sectionDescKoEn
          } ${
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-label']
              : fontStyles['korean-font-label']
          }`}
        >
          {description}
        </p>
      )}
      {hex ? (
        <div className={styles.luckyColorBox}>
          <div
            className={styles.luckyColorSwatch}
            style={{ backgroundColor: hex }}
            title={content?.[0]}
            aria-hidden
          />
          {content?.[0] && (
            <span
              className={
                browserLanguage === 'ja'
                  ? fontStyles['japanese-font-label']
                  : fontStyles['korean-font-label']
              }
            >
              {content[0]}
            </span>
          )}
        </div>
      ) : (
        <ul className={styles.list}>
          {content?.map((item, index) => (
            <li
              key={index}
              className={
                browserLanguage === 'ja'
                  ? fontStyles['japanese-font-label']
                  : fontStyles['korean-font-label']
              }
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const Keywords = ({ title, keywords }) => (
    <div className={`${styles.section} ${styles.blue}`}>
      <h3
        className={
          browserLanguage === 'ja'
            ? fontStyles['japanese-font-small-title']
            : fontStyles['korean-font-small-title']
        }
      >
        {title}
      </h3>
      <div className={styles.keywords}>
        {keywords?.map((keyword, index) => (
          <span
            key={index}
            className={`${styles.keyword} ${
              browserLanguage === 'ja'
                ? fontStyles['japanese-font-label']
                : fontStyles['korean-font-label']
            }`}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );

  if (!selectedCard) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2
          className={
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-title']
              : fontStyles['korean-font-title']
          }
        >
          {t('daily-tarot.card')}
        </h2>
        <h2
          className={
            browserLanguage === 'ja'
              ? fontStyles['japanese-font-title']
              : fontStyles['korean-font-title']
          }
        >
          {selectedCard.name}
        </h2>
      </div>

      <div className={styles.content}>
        {sectionData.map((s) =>
          s.type === 'keywords' ? (
            <Keywords key={s.id} title={t(s.titleKey)} keywords={s.content} />
          ) : (
            <Section
              key={s.id}
              title={t(s.titleKey)}
              content={s.content}
              color={s.color}
              description={
                s.id === 'one-line'
                  ? t('daily-tarot.one-line-desc')
                  : s.id === 'message'
                    ? t('daily-tarot.message-desc')
                    : undefined
              }
              hex={s.hex}
            />
          )
        )}
      </div>
    </div>
  );
};

export default DailyTarotFortune;
