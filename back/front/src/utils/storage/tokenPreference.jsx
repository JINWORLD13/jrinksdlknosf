import { Preferences } from '@capacitor/preferences';
import { isDevelopmentMode, isProductionMode } from '@/utils/constants';

const TOKEN_EXPIRATION_TIME = 14 * 24 * 60 * 60 * 1000; // 14일 in milliseconds
const REWARD_EXPIRATION_TIME = 365 * 24 * 60 * 60 * 1000; // 365일 in milliseconds

// New function to remove expired tokens
const removeExpiredToken = async key => {
  const preferenceData = await Preferences.get({
    key,
  });
  if (!preferenceData) return false;
  const { value } = preferenceData; //! preference는 코드 object임.
  if (!value) {
    return false; // 또는 적절한 기본값
  }
  const { token, expiresAt } = JSON.parse(value); //~ preference의 value는 localStorage의 value처럼 JSON임.
  if (token) {
    if (Date.now() >= expiresAt) {
      await Preferences.remove({ key });
      return true;
    }
  }
  return false;
};

// New function to set token with expiration
const setTokenForPreference = async (key, tokenKey) => {
  if (tokenKey !== null && tokenKey !== undefined) {
    const expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
    await Preferences.set({
      key,
      value: JSON.stringify({ token: tokenKey, expiresAt }),
    });
  }
};

// New function to get token with automatic removal if expired
const getTokenForPreference = async key => {
  // Check and remove if expired
  if (await removeExpiredToken(key)) {
    return null;
  }
  const preferenceData = await Preferences.get({
    key,
  });
  if (!preferenceData) return null;
  const { value } = preferenceData; //! preference는 코드 object임.
  if (!value) {
    return null; // 또는 적절한 기본값
  }
  const parsedValue = JSON.parse(value); //~ preference의 value는 localStorage의 value처럼 JSON임.
  const { token, expiresAt } = parsedValue;
  if (token) {
    if (Date.now() < expiresAt) {
      return token;
    } else {
      return null;
    }
  }
  return null;
};

// Modified to use new setTokenForPreference function
export const setAccessTokenForPreference = async accessTokenKey => {
  await setTokenForPreference('accessTokenCosmos', accessTokenKey);
};

// Modified to use new setTokenForPreference function
export const setRefreshTokenForPreference = async refreshTokenKey => {
  await setTokenForPreference('refreshTokenCosmos', refreshTokenKey);
};

// Modified to use new getTokenForPreference function
export const getAccessTokenForPreference = async () => {
  return await getTokenForPreference('accessTokenCosmos');
};

// Modified to use new getTokenForPreference function
export const getRefreshTokenForPreference = async () => {
  return await getTokenForPreference('refreshTokenCosmos');
};

export const hasAccessTokenForPreference = async () => {
  const accessToken = await getAccessTokenForPreference();
  return accessToken !== null;
};

export const hasRefreshTokenForPreference = async () => {
  const refreshToken = await getRefreshTokenForPreference();
  return refreshToken !== null;
};

// Modified to use new setTokenForPreference function
export const setGoogleAccessTokenForPreference = async accessTokenKey => {
  await setTokenForPreference('gAccessTokenCosmos', accessTokenKey);
};

// Modified to use new setTokenForPreference function
export const setGoogleRefreshTokenForPreference = async refreshTokenKey => {
  await setTokenForPreference('gRefreshTokenCosmos', refreshTokenKey);
};

export const removeAccessTokensForPreference = async () => {
  await Preferences.remove({ key: 'accessTokenCosmos' });
  await Preferences.remove({ key: 'gAccessTokenCosmos' });
};

export const removeRefreshTokensForPreference = async () => {
  await Preferences.remove({ key: 'refreshTokenCosmos' });
  await Preferences.remove({ key: 'gRefreshTokenCosmos' });
};

// New function to remove all expired tokens
export const removeAllExpiredTokens = async () => {
  await removeExpiredToken('accessTokenCosmos');
  await removeExpiredToken('refreshTokenCosmos');
  await removeExpiredToken('gAccessTokenCosmos');
  await removeExpiredToken('gRefreshTokenCosmos');
};

//! admob reward 관련
export const removeExpiredReward = async (
  rewardType = 'Voucher',
  userEmail
) => {
  const userAccount = userEmail?.split('@')[0];
  const preferenceData = await Preferences.get({
    key: rewardType + userAccount + isProductionMode,
  });
  if (!preferenceData) return false;
  const { value } = preferenceData; //! preference는 코드 object임.
  if (!value) {
    return false; // 또는 적절한 기본값
  }
  const parsedValue = JSON.parse(value); //~ preference의 value는 localStorage의 value처럼 JSON임.
  if (parsedValue?.rewardAmount > 0) {
    if (Date.now() >= parsedValue.expiresAt) {
      await Preferences.remove({
        key: rewardType + userAccount + isProductionMode,
      });
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const setRewardForPreference = async (
  rewardType = 'Voucher',
  newRewardAmount,
  userEmail
) => {
  if (
    typeof newRewardAmount === 'number' &&
    !isNaN(newRewardAmount) &&
    typeof userEmail === 'string' &&
    userEmail?.length > 0
  ) {
    const userAccount = userEmail.split('@')[0];
    const preferenceData = await Preferences.get({
      key: rewardType + userAccount + isProductionMode,
    });
    if (!preferenceData) return;
    const { value } = preferenceData; //! preference는 코드 object임.
    const parsedValue = JSON.parse(value); //~ preference의 value는 localStorage의 value처럼 JSON임.
    let existingReward = { rewardAmount: 0, expiresAt: 0 };
    if (parsedValue?.rewardAmount > 0) {
      existingReward = parsedValue;
      if (Date.now() >= existingReward.expiresAt) {
        existingReward.rewardAmount = 0;
      } else {
        existingReward.rewardAmount = parsedValue?.rewardAmount;
      }
    } else {
      if (isDevelopmentMode) {
        console.log(
          `${
            rewardType + userAccount + isProductionMode
          }에 대한 새로운 Preference 생성`
        );
      }
    }
    const updatedRewardAmount = existingReward.rewardAmount + newRewardAmount;
    const expiresAt = Date.now() + REWARD_EXPIRATION_TIME;

    await Preferences.set({
      key: rewardType + userAccount + isProductionMode,
      value: JSON.stringify({ rewardAmount: updatedRewardAmount, expiresAt }),
    });
    if (isDevelopmentMode) {
      console.log(
        `${
          rewardType + userAccount + isProductionMode
        } 리워드 업데이트: ${updatedRewardAmount}`
      );
    }
  }
};

export const getRewardForPreference = async (
  rewardType = 'Voucher',
  userEmail
) => {
  const userAccount = userEmail?.split('@')[0];
  if (userEmail === undefined || userEmail === null || userEmail === '')
    return 0;
  if (userAccount) {
    const ResultOfRemove = await removeExpiredReward(rewardType, userEmail);
    if (ResultOfRemove) {
      return 0;
    }
    if (
      userEmail === undefined ||
      userEmail === null ||
      userEmail === '' ||
      userAccount === undefined ||
      userAccount === null
    )
      return 0;
    const preferenceData = await Preferences.get({
      key: rewardType + userAccount + isProductionMode,
    });
    if (!preferenceData) return 0;
    const { value } = preferenceData; //! preference는 코드 object임.
    if (!value) {
      return 0; // 또는 적절한 기본값
    }
    const parsedValue = JSON.parse(value); //~ preference의 value는 localStorage의 value처럼 JSON임.
    if (parsedValue?.rewardAmount > 0) {
      if (Date.now() < parsedValue.expiresAt) {
        return parsedValue.rewardAmount;
      } else {
        return 0;
      }
    }
    return 0;
  }
};

export const useRewardForPreference = async (
  rewardType = 'Voucher',
  amountToUse = 1,
  userEmail
) => {
  const userAccount = userEmail?.split('@')[0];
  if (userAccount) {
    const isExpired = await removeExpiredReward(rewardType, userEmail);
    if (isExpired) {
      if (isDevelopmentMode) {
        console.log(
          `${
            rewardType + userAccount + isProductionMode
          } 리워드가 만료되어 제거되었습니다.`
        );
      }
      return false;
    }

    const currentReward = await getRewardForPreference(rewardType, userEmail);

    if (currentReward === null || currentReward < amountToUse) {
      if (isDevelopmentMode) {
        console.log(
          `${
            rewardType + userAccount + isProductionMode
          } 리워드가 부족하거나 없습니다.`
        );
      }
      return false;
    }

    const updatedRewardAmount = currentReward - amountToUse;
    const expiresAt = Date.now() + REWARD_EXPIRATION_TIME;

    await Preferences.set({
      key: rewardType + userAccount + isProductionMode,
      value: JSON.stringify({ rewardAmount: updatedRewardAmount, expiresAt }),
    });

    if (isDevelopmentMode) {
      console.log(
        `${
          rewardType + userAccount + isProductionMode
        } 리워드 사용: ${amountToUse}, 남은 수량: ${updatedRewardAmount}`
      );
    }
    return true;
  }
};

//! 제너럴 리딩 전면광고: 1세트(10번)당 1번만 표시, 세트 내 광고 순서는 랜덤. Preferences에 저장, 키에 email로 유저별 구분
export const GENERAL_READING_AD_COUNT_KEY_PREFIX = 'general_reading_ad_count_';
const SET_SIZE = 10;

/** 1~10 랜덤 (세트 내 광고 노출 순서) */
const randomAdPositionInSet = () => 1 + Math.floor(Math.random() * SET_SIZE);

/** 이메일을 스토리지 키에 쓸 수 있도록 치환 (유저마다 고유 키) */
const sanitizeEmailForKey = email => {
  if (!email || typeof email !== 'string') return '';
  return email.replace(/@/g, '_at_').replace(/\./g, '_').replace(/\+/g, '_');
};

/** 유저 구분용 스토리지 키 생성: 로그인 시 email 포함, 비로그인 시 deviceId */
export const getGeneralReadingAdCountKey = (email, deviceId) => {
  if (email && typeof email === 'string') {
    const safe = sanitizeEmailForKey(email);
    return `${GENERAL_READING_AD_COUNT_KEY_PREFIX}email_${safe}`;
  }
  if (deviceId && typeof deviceId === 'string') {
    return `${GENERAL_READING_AD_COUNT_KEY_PREFIX}anon_${deviceId}`;
  }
  return '';
};

/**
 * 현재 세트 상태 조회. { countInCurrentSet: 0~9, adPositionInSet: 1~10, adTurnPending?: boolean }
 * adTurnPending: 광고 턴에서 취소한 상태 — 이 턴에서는 광고 시청해야만 진행 가능.
 */
export const getGeneralReadingAdState = async key => {
  if (!key) {
    return { countInCurrentSet: 0, adPositionInSet: randomAdPositionInSet(), adTurnPending: false };
  }
  const fullKey = key.startsWith(GENERAL_READING_AD_COUNT_KEY_PREFIX)
    ? key
    : GENERAL_READING_AD_COUNT_KEY_PREFIX + key;
  const { value } = await Preferences.get({ key: fullKey });
  if (!value) {
    return { countInCurrentSet: 0, adPositionInSet: randomAdPositionInSet(), adTurnPending: false };
  }
  const n = parseInt(value, 10);
  if (Number.isInteger(n) && n >= 0) {
    const migrated = {
      countInCurrentSet: n % SET_SIZE,
      adPositionInSet: randomAdPositionInSet(),
      adTurnPending: false,
    };
    await Preferences.set({ key: fullKey, value: JSON.stringify(migrated) });
    return migrated;
  }
  try {
    const parsed = JSON.parse(value);
    const count = Math.max(0, Math.min(SET_SIZE - 1, parseInt(parsed?.countInCurrentSet, 10) || 0));
    const pos = Math.max(1, Math.min(SET_SIZE, parseInt(parsed?.adPositionInSet, 10) || randomAdPositionInSet()));
    const adTurnPending = parsed?.adTurnPending === true;
    return { countInCurrentSet: count, adPositionInSet: pos, adTurnPending };
  } catch {
    return { countInCurrentSet: 0, adPositionInSet: randomAdPositionInSet(), adTurnPending: false };
  }
};

/** 광고 턴임을 저장 — 취소 후 다른 질문/스프레드 눌러도 광고 시청해야만 진행되도록 */
export const setGeneralReadingAdTurnPending = async (key, pending) => {
  if (!key) return;
  const fullKey = key.startsWith(GENERAL_READING_AD_COUNT_KEY_PREFIX)
    ? key
    : GENERAL_READING_AD_COUNT_KEY_PREFIX + key;
  const state = await getGeneralReadingAdState(fullKey);
  await Preferences.set({
    key: fullKey,
    value: JSON.stringify({ ...state, adTurnPending: !!pending }),
  });
};

/**
 * 리딩 1회 완료 시 호출(광고 시청 후에만). 세트 진행, adTurnPending 해제.
 */
export const advanceGeneralReadingAdState = async key => {
  if (!key) return { countInCurrentSet: 0, adPositionInSet: randomAdPositionInSet(), adTurnPending: false };
  const fullKey = key.startsWith(GENERAL_READING_AD_COUNT_KEY_PREFIX)
    ? key
    : GENERAL_READING_AD_COUNT_KEY_PREFIX + key;
  const state = await getGeneralReadingAdState(fullKey);
  const nextCount = (state.countInCurrentSet + 1) % SET_SIZE;
  const adPositionInSet = nextCount === 0 ? randomAdPositionInSet() : state.adPositionInSet;
  const next = { countInCurrentSet: nextCount, adPositionInSet, adTurnPending: false };
  await Preferences.set({ key: fullKey, value: JSON.stringify(next) });
  return next;
};

//! YesNo 카드 전면광고: 5~10번 중 1번만 표시 (키는 email로 구분)
const YESNO_INTERSTITIAL_KEY_PREFIX = 'yesno_interstitial_';

export const getYesNoInterstitialState = async userEmail => {
  const userAccount = userEmail?.split('@')[0];
  if (!userAccount) return { count: 0, showAt: 5 + Math.floor(Math.random() * 6) };
  const key = YESNO_INTERSTITIAL_KEY_PREFIX + userAccount;
  const { value } = await Preferences.get({ key });
  if (!value) return { count: 0, showAt: 5 + Math.floor(Math.random() * 6) };
  try {
    const parsed = JSON.parse(value);
    const count = typeof parsed?.count === 'number' ? parsed.count : 0;
    const showAt = typeof parsed?.showAt === 'number' && parsed.showAt >= 5 && parsed.showAt <= 10
      ? parsed.showAt
      : 5 + Math.floor(Math.random() * 6);
    return { count, showAt };
  } catch {
    return { count: 0, showAt: 5 + Math.floor(Math.random() * 6) };
  }
};

export const setYesNoInterstitialState = async (userEmail, { count, showAt }) => {
  const userAccount = userEmail?.split('@')[0];
  if (!userAccount) return;
  const key = YESNO_INTERSTITIAL_KEY_PREFIX + userAccount;
  const nextShowAt = typeof showAt === 'number' && showAt >= 5 && showAt <= 10
    ? showAt
    : 5 + Math.floor(Math.random() * 6);
  await Preferences.set({
    key,
    value: JSON.stringify({
      count: typeof count === 'number' ? count : 0,
      showAt: nextShowAt,
    }),
  });
};

//! Daily Tarot Card
// Utility function to format date consistently across the app
export const formatLocalDate = (
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  if (isDevelopmentMode) {
    console.log('[Native-DailyTarot] formatLocalDate:', {
      timezone,
      now: now.toISOString(),
      formattedDate,
    });
  }
  return formattedDate;
};

// Sets today's card information in Preferences
export const setTodayCardForNative = async (
  todayCardIndex,
  userInfo,
  fortuneMessage = null,
  cardImage = null
) => {
  if (isDevelopmentMode) {
    console.log('[Native-DailyTarot] setTodayCardForNative START:', {
      todayCardIndex,
      userEmail: userInfo?.email,
      hasFortuneMessage: !!fortuneMessage,
      hasCardImage: !!cardImage,
    });
  }

  try {
    if (
      todayCardIndex !== null &&
      todayCardIndex !== undefined &&
      userInfo?.id
    ) {
      const localDate = formatLocalDate();
      const cardData = {
        index: todayCardIndex,
        date: localDate,
        fortuneMessage: fortuneMessage,
        cardImage: cardImage,
      };

      const cardKey = `todayCard-${userInfo?.id}`;
      if (isDevelopmentMode) {
        console.log('[Native-DailyTarot] setTodayCardForNative - Saving:', {
          cardKey,
          cardData,
        });
      }

      await Preferences.set({
        key: cardKey,
        value: JSON.stringify(cardData),
      });

      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] setTodayCardForNative - SUCCESS saved to Preferences'
        );
      }
    } else {
      if (isDevelopmentMode) {
        console.warn(
          '[Native-DailyTarot] setTodayCardForNative - SKIPPED (invalid params):',
          {
            todayCardIndex,
            hasEmail: !!userInfo?.email,
          }
        );
      }
    }
  } catch (error) {
    if (isDevelopmentMode) {
      console.error(
        '[Native-DailyTarot] setTodayCardForNative - ERROR:',
        error
      );
    }
  }
};

// Gets today's card information from Preferences
export const getTodayCardForNative = async (
  userInfo,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  if (isDevelopmentMode) {
    console.log('[Native-DailyTarot] getTodayCardForNative START:', {
      userEmail: userInfo?.email,
      timezone,
    });
  }

  try {
    if (!userInfo || !userInfo?.id || userInfo?.id === '') {
      if (isDevelopmentMode) {
        console.warn(
          '[Native-DailyTarot] getTodayCardForNative - No user info, returning null'
        );
      }
      return null;
    }

    const cardKey = `todayCard-${userInfo?.id}`;
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardForNative - Getting from Preferences:',
        cardKey
      );
    }

    const result = await Preferences.get({
      key: cardKey,
    });
    const savedData = result.value;

    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardForNative - Raw data from Preferences:',
        {
          hasValue: !!savedData,
          valueLength: savedData?.length,
          rawData: savedData, // 실제 원본 데이터
        }
      );
    }

    // If no saved data exists, return null
    if (!savedData) {
      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] getTodayCardForNative - No saved data, returning null'
        );
      }
      return null;
    }

    const cardData = JSON.parse(savedData);
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardForNative - Parsed cardData:',
        JSON.stringify(cardData, null, 2) // JSON으로 출력
      );
    }

    // Validate cardData structure
    if (!cardData || !cardData.date) {
      if (isDevelopmentMode) {
        console.warn(
          '[Native-DailyTarot] getTodayCardForNative - Invalid cardData structure, returning null'
        );
      }
      return null;
    }

    const savedDate = new Date(cardData.date);
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDateStr = formatter.format(now);
    const savedDateStr = formatter.format(savedDate);

    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardForNative - Date comparison:',
        JSON.stringify(
          {
            currentDateStr,
            savedDateStr,
            savedDateRaw: cardData.date,
            isExpired: currentDateStr !== savedDateStr,
            timezone,
          },
          null,
          2
        )
      );
    }

    // 날짜가 바뀌었으면 기존 카드 정보 삭제
    if (currentDateStr !== savedDateStr) {
      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] getTodayCardForNative - Date expired, removing old card'
        );
      }
      await Preferences.remove({ key: cardKey }); // 올바른 키 사용
      return null;
    }

    if (cardData?.index === 0) {
      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] getTodayCardForNative - Returning index 0'
        );
      }
      return 0;
    }

    const returnValue = cardData?.index ?? null;
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardForNative - SUCCESS returning:',
        returnValue
      );
    }
    return returnValue;
  } catch (error) {
    if (isDevelopmentMode) {
      console.error(
        '[Native-DailyTarot] getTodayCardForNative - ERROR:',
        error
      );
      console.error(
        '[Native-DailyTarot] getTodayCardForNative - Error stack:',
        error.stack
      );
    }
    return null;
  }
};

// 오늘의 타로 카드 전체 정보 가져오기 (인덱스, 운세 메시지, 카드 이미지)
export const getTodayCardFullDataForNative = async (
  userInfo,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  if (isDevelopmentMode) {
    console.log('[Native-DailyTarot] getTodayCardFullDataForNative START:', {
      userEmail: userInfo?.email,
      timezone,
    });
  }

  try {
    if (!userInfo || !userInfo?.id || userInfo?.id === '') {
      if (isDevelopmentMode) {
        console.warn(
          '[Native-DailyTarot] getTodayCardFullDataForNative - No user info, returning null'
        );
      }
      return null;
    }

    const cardKey = `todayCard-${userInfo?.id}`;
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardFullDataForNative - Getting from Preferences:',
        cardKey
      );
    }

    const result = await Preferences.get({
      key: cardKey,
    });
    const savedData = result.value;

    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardFullDataForNative - Raw data from Preferences:',
        {
          hasValue: !!savedData,
          valueLength: savedData?.length,
        }
      );
    }

    // If no saved data exists, return null
    if (!savedData) {
      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] getTodayCardFullDataForNative - No saved data, returning null'
        );
      }
      return null;
    }

    const cardData = JSON.parse(savedData);
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardFullDataForNative - Parsed cardData:',
        cardData
      );
    }

    // Validate cardData structure
    if (!cardData || !cardData.date) {
      if (isDevelopmentMode) {
        console.warn(
          '[Native-DailyTarot] getTodayCardFullDataForNative - Invalid cardData structure, returning null'
        );
      }
      return null;
    }

    const savedDate = new Date(cardData.date);
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDateStr = formatter.format(now);
    const savedDateStr = formatter.format(savedDate);

    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardFullDataForNative - Date comparison:',
        {
          currentDateStr,
          savedDateStr,
          isExpired: currentDateStr !== savedDateStr,
        }
      );
    }

    // 날짜가 바뀌었으면 기존 카드 정보 삭제
    if (currentDateStr !== savedDateStr) {
      if (isDevelopmentMode) {
        console.log(
          '[Native-DailyTarot] getTodayCardFullDataForNative - Date expired, removing old card'
        );
      }
      await Preferences.remove({ key: cardKey });
      return null;
    }

    // 전체 카드 데이터 반환 (인덱스, 운세 메시지, 카드 이미지)
    if (isDevelopmentMode) {
      console.log(
        '[Native-DailyTarot] getTodayCardFullDataForNative - SUCCESS returning full data:',
        cardData
      );
    }
    return cardData;
  } catch (error) {
    if (isDevelopmentMode) {
      console.error(
        '[Native-DailyTarot] getTodayCardFullDataForNative - ERROR:',
        error
      );
      console.error(
        '[Native-DailyTarot] getTodayCardFullDataForNative - Error stack:',
        error.stack
      );
    }
    return null;
  }
};

// Removes today's card information from Preferences
export const removeTodayCardsForNative = async userInfo => {
  try {
    if (userInfo?.id) {
      await Preferences.remove({
        key: `todayCard-${userInfo?.id}`,
      });
    }
  } catch (error) {
    console.error('Error removing today cards : ', error);
  }
};

//~ 광고Free 카운트 세기
export const setAdsFree = async userInfo => {
  try {
    // 이메일 유효성 검사
    if (!userInfo?.email || userInfo?.email === '') return false;

    const emailPrefix = userInfo?.email.split('@')[0];
    const key = `AF-${emailPrefix}`;

    // 랜덤 결과 생성
    const randomResult = Math.round(Math.random()); // 0 또는 1

    // 저장된 값 가져오기
    const { value } = await Preferences.get({ key });
    let adFreeHistory = value ? JSON.parse(value) : [];

    //! 아무 정보가 없을때 혹은 0개일때
    if (!adFreeHistory || adFreeHistory?.length === 0) {
      adFreeHistory.push(randomResult);
      await Preferences.set({ key, value: JSON.stringify(adFreeHistory) });
      return;
    }

    //! 1개일때
    if (adFreeHistory?.length === 1) {
      adFreeHistory[0] === 1 ? adFreeHistory.push(0) : adFreeHistory.push(1);
      await Preferences.set({ key, value: JSON.stringify(adFreeHistory) }); //! 길이가 2됨
      return;
    }

    //! 2개 이상일때,
    // 결과 반환 (1이면 광고 면제, 0이면 광고 표시)
    if (adFreeHistory?.length >= 2) {
      adFreeHistory.shift(); // 첫 번째 요소 제거
      adFreeHistory[0] === 1 ? adFreeHistory.push(0) : adFreeHistory.push(1);
      await Preferences.set({ key, value: JSON.stringify(adFreeHistory) }); //! 길이가 1됨
      return;
    }
  } catch (error) {
    console.error('Error in isAdsFree:', error);
    // return false; // 에러 시 기본값으로 광고 표시
  }
};

export const getAdsFree = async userInfo => {
  try {
    // 이메일 유효성 검사
    if (!userInfo?.email || userInfo?.email === '') return false;

    const emailPrefix = userInfo?.email.split('@')[0];
    const key = `AF-${emailPrefix}`;

    // 저장된 값 가져오기 (''일경우 js에선 falsy 값)
    const { value } = await Preferences.get({ key });
    let adFreeHistory = value ? JSON.parse(value) : [];

    // 아무 정보가 없을때 혹은 0개일때
    if (!adFreeHistory || adFreeHistory?.length === 0) {
      // 랜덤 결과 생성
      const randomResult = Math.round(Math.random()); // 0 또는 1
      adFreeHistory.push(randomResult);
      await Preferences.set({ key, value: JSON.stringify(adFreeHistory) });
      return adFreeHistory[0] === 1; //! 첫번째 요소로 고정
    }

    return adFreeHistory[adFreeHistory?.length - 1] === 1;
  } catch (error) {
    console.error('Error in isAdsFree:', error);
    return false; // 에러 시 기본값으로 광고 표시
  }
};

export const preferenceForLockButton = {
  async getItem(key) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  },

  async setItem(key, value) {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  },

  async removeItem(key) {
    await Preferences.remove({ key });
  },

  async clear() {
    await Preferences.clear();
  },
};
