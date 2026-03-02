export const setAccessToken = accessTokenKey => {
  if (accessTokenKey !== null && accessTokenKey !== undefined) {
    localStorage.setItem('accessToken', accessTokenKey);
  }
};
export const setRefreshToken = refreshTokenKey => {
  if (refreshTokenKey !== null && refreshTokenKey !== undefined) {
    localStorage.setItem('refreshToken', refreshTokenKey);
  }
};

export const getAccessToken = () => {
  const keyValue = localStorage?.getItem('accessToken') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result;
};
export const getRefreshToken = () => {
  const keyValue = localStorage?.getItem('refreshToken') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result;
};

export const hasAccessToken = () => {
  const accessToken = getAccessToken();
  if (accessToken === undefined) {
    return false;
  } else {
    return accessToken !== null; // 유효한 token이 있으면 true, 토큰 자체가 없으면 false
  }
};
export const hasRefreshToken = () => {
  const refreshToken = getRefreshToken();
  if (refreshToken === undefined) {
    return false;
  } else {
    return refreshToken !== null; // 유효한 token이 있으면 true, 토큰 자체가 없으면 false
  }
};

export const setGoogleAccessToken = accessTokenKey => {
  // path : 설정한 경로 및 하위 경로에서만 해당 쿠키가 적용
  if (accessTokenKey !== null && accessTokenKey !== undefined) {
    localStorage.set('gAccessToken', accessTokenKey, { expires: 7 });
  }
};

export const setGoogleRefreshToken = refreshTokenKey => {
  if (refreshTokenKey !== null && refreshTokenKey !== undefined) {
    localStorage.set('gRefreshToken', refreshTokenKey, { expires: 7 });
  }
};

export const getGoogleAccessToken = () => {
  const keyValue = localStorage.get('gAccessToken') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result; // null 아니면 value 반환
};

export const getGoogleRefreshToken = () => {
  const keyValue = localStorage.get('gRefreshToken') ?? null;
  const result = keyValue === undefined ? null : keyValue;
  return result;
};

export const hasGoogleAccessToken = () => {
  const gAccessToken = getGoogleAccessToken();

  if (gAccessToken === undefined) {
    return false;
  } else {
    return gAccessToken !== null;
  }
};

export const hasGoogleRefreshToken = () => {
  const gRefreshToken = getGoogleRefreshToken();
  if (gRefreshToken === undefined) {
    return false;
  } else {
    return gRefreshToken !== null;
  }
};

export const removeAccessTokens = () => {
  localStorage.remove('accessToken');
  localStorage.remove('gAccessToken');
};

export const removeRefreshTokens = () => {
  localStorage.remove('refreshToken');
  localStorage.remove('gRefreshToken');
};

//!
export const formatLocalDate = (
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
};

export const setTodayCard = (
  todayCardIndex,
  userInfo,
  fortuneMessage = null,
  cardImage = null
) => {
  if (todayCardIndex !== null && todayCardIndex !== undefined) {
    const localDate = formatLocalDate();
    const cardData = {
      index: todayCardIndex,
      date: localDate,
      fortuneMessage: fortuneMessage,
      cardImage: cardImage,
    };
    localStorage.setItem(`todayCard-${userInfo?.id}`, JSON.stringify(cardData));
  }
};

export const getTodayCard = (
  userInfo,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  try {
    if (
      !userInfo ||
      !userInfo?.id ||
      userInfo?.id === '' ||
      Object.keys(userInfo).length === 0
    )
      return null;

    const now = new Date();
    const cardKey = `todayCard-${userInfo?.id}`;
    const savedData = localStorage.getItem(`todayCard-${userInfo?.id}`);

    // savedData가 없으면 바로 리턴
    if (!savedData) return null;

    const cardData = JSON.parse(savedData);

    // cardData나 date가 없으면 리턴
    if (!cardData || !cardData.date) return null;

    const savedDate = new Date(cardData.date);
    // console.log('Parsed savedDate:', savedDate);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDateStr = formatter.format(now);
    const savedDateStr = formatter.format(savedDate);

    // 날짜가 바뀌었으면 기존 카드 정보 삭제하고 null 리턴
    if (currentDateStr !== savedDateStr) {
      localStorage.removeItem(cardKey);
      return null;
    }

    // js의 한계. 0이면 fasly를 리턴하니 아래 || 우측의 null을 리턴하게 되어서 따로 설정.
    if (cardData?.index === 0) return 0;

    return cardData?.index || null;
  } catch (e) {
    console.error('Error parsing today card data:', e);
    return null;
  }
};

// 오늘의 타로 카드 전체 정보 가져오기 (인덱스, 운세 메시지, 카드 이미지)
export const getTodayCardFullData = (
  userInfo,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  try {
    if (
      !userInfo ||
      !userInfo?.id ||
      userInfo?.id === '' ||
      Object.keys(userInfo).length === 0
    )
      return null;

    const now = new Date();
    const cardKey = `todayCard-${userInfo?.id}`;
    const savedData = localStorage.getItem(`todayCard-${userInfo?.id}`);

    // savedData가 없으면 바로 리턴
    if (!savedData) return null;

    const cardData = JSON.parse(savedData);

    // cardData나 date가 없으면 리턴
    if (!cardData || !cardData.date) return null;

    const savedDate = new Date(cardData.date);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDateStr = formatter.format(now);
    const savedDateStr = formatter.format(savedDate);

    // 날짜가 바뀌었으면 기존 카드 정보 삭제하고 null 리턴
    if (currentDateStr !== savedDateStr) {
      localStorage.removeItem(cardKey);
      return null;
    }

    // 전체 카드 데이터 반환 (인덱스, 운세 메시지, 카드 이미지)
    return cardData;
  } catch (e) {
    console.error('Error parsing today card data:', e);
    return null;
  }
};

export const removeTodayCards = userInfo => {
  localStorage.removeItem(`todayCard-${userInfo?.id}`);
};

export const localStorageForLockButton = {
  getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
