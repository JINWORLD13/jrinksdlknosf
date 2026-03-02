export const isWithinThisYear = oneTarotHistory => {
  //'2024-01-13T19:44:59.476+00:00' 이런 형식(그리니치 시각)이었는데,
  const period = oneTarotHistory?.createdAt;
  // 데이터가 저장된 날짜 (예시)
  //Sun Jan 14 2024 07:50:00 GMT+0900 (한국 표준시) 이런형식으로 찍힘
  const dataDate = new Date(period);
  // 현재 로컬 날짜
  const currentDate = new Date();
  // 2024 이렇게 나옴
  const dataYear = dataDate.getFullYear();
  const currentYear = currentDate.getFullYear();
  //! 올해
  if (currentYear === dataYear) return true;
  return false;
};
export const isWithinThisThreeMonth = oneTarotHistory => {
  const currentDate = new Date();
  const tarotCreatedDateInDB = oneTarotHistory?.createdAt;
  const tarotCreatedDate = new Date(tarotCreatedDateInDB);
  const threeMonthsLater = new Date(
    tarotCreatedDate.getFullYear(),
    tarotCreatedDate.getMonth() + 3,
    tarotCreatedDate.getDate()
  );
  let remainingTime = threeMonthsLater - currentDate;
  if (remainingTime > 0) return true;
  return false;
};

export const isWithinThisMonth = oneTarotHistory => {
  const tarotCreatedDateInDB = oneTarotHistory?.createdAt;
  const tarotCreatedDate = new Date(tarotCreatedDateInDB);
  const yearOfTarotCreatedDate = tarotCreatedDate.getFullYear();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // 1월은 0, 12월은 11
  const monthOfTarotCreatedDate = tarotCreatedDate.getMonth();
  const currentMonth = currentDate.getMonth();
  if (
    currentMonth === monthOfTarotCreatedDate &&
    currentYear === yearOfTarotCreatedDate
  )
    return true;
  return false;
};

export const isWithinThisWeek = oneTarotHistory => {
  const A_WEEK_IN_MILLIS = 7 * 24 * 60 * 60 * 1000;

  const tarotCreatedDateInDB = oneTarotHistory?.createdAt;
  const tarotCreatedFullDate = new Date(tarotCreatedDateInDB);
  const tarotCreatedDate = tarotCreatedFullDate.getDate();
  const tarotCreatedDay = tarotCreatedFullDate.getDay();
  const monthOfTarotCreatedDate = tarotCreatedFullDate.getMonth();

  const currentFullDate = new Date();
  const currentDate = currentFullDate.getDate(); // 5일이면 5로 나옴.
  const currentDay = currentFullDate.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ...)
  const currentYear = currentFullDate.getFullYear();

  //! 7일 초과로 차이 나는 건 컷.
  if (currentFullDate - tarotCreatedFullDate > A_WEEK_IN_MILLIS) return;

  const thisWeek = new Date(currentFullDate); //! 이번주를 계산하기 위함.
  if (currentDay - tarotCreatedDay < 0) {
    //! 지난주
    return;
  } else if (currentDay - tarotCreatedDay > 0) {
    //! 이번주 혹은 그 이상(하지만, 7일 초과과 차이 나는건 위 조건문에서 컷함.)
    thisWeek.setDate(currentDate - currentDay);
  } else if (currentDay - tarotCreatedDay === 0) {
    //! 이번주이자 오늘
    thisWeek.setDate(currentDate - currentDay);
  }
  thisWeek.setHours(0, 0, 0, 0);

  const firstDateOfThisWeek = thisWeek.getDate();
  const monthOfFirstDateOfThisWeek = thisWeek.getMonth();
  const yearOfThisWeek = thisWeek.getFullYear();

  let isThisWeek;
  //! 연도 설정 필요 없음
  if (monthOfTarotCreatedDate === monthOfFirstDateOfThisWeek) {
    isThisWeek = tarotCreatedDate >= firstDateOfThisWeek;
  }
  //! 연도 설정 안해도 무조건 같은 해임.
  if (monthOfTarotCreatedDate > monthOfFirstDateOfThisWeek) {
    isThisWeek = tarotCreatedDate < firstDateOfThisWeek;
  }
  //~ 연도 설정해줘야 함.
  //~ 1월(0) < 12월(11)
  if (monthOfTarotCreatedDate < monthOfFirstDateOfThisWeek) {
    if (currentYear === yearOfThisWeek) isThisWeek = false;
    if (currentYear !== yearOfThisWeek) {
      //& tarotCreatedFullDate - thisWeek은 무조건 0보다 큼. 신경 쓸 필요 없음.
      if (tarotCreatedFullDate - thisWeek <= A_WEEK_IN_MILLIS) {
        isThisWeek = true;
      } else {
        isThisWeek = false;
      }
    }
  }

  return isThisWeek;
};

export const isWithinThisDay = oneTarotHistory => {
  const tarotCreatedDateInDB = oneTarotHistory?.createdAt;
  const tarotCreatedDate = new Date(tarotCreatedDateInDB);
  const tarotCreatedDay = new Date();
  const yearOfTarotCreatedDay = tarotCreatedDate.getFullYear();
  const currentYear = tarotCreatedDay.getFullYear();
  const monthOfTarotCreatedDay = tarotCreatedDate.getMonth();
  const currentMonth = tarotCreatedDay.getMonth();
  const dayOfTarotCreatedDay = tarotCreatedDate.getDate();
  const currentDay = tarotCreatedDay.getDate();
  const isWithinThisDay =
    dayOfTarotCreatedDay === currentDay &&
    monthOfTarotCreatedDay === currentMonth &&
    yearOfTarotCreatedDay === currentYear;
  return isWithinThisDay;
};

export const isYearAgo = oneTarotHistory => {
  const period = oneTarotHistory?.createdAt;
  const dataDate = new Date(period);
  const currentDate = new Date();
  const dataYear = dataDate.getFullYear();
  const currentYear = currentDate.getFullYear();
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
  const isWithinOneYearAgo = dataDate > oneYearAgo;
  //! 12개월 내  true
  if (currentYear === dataYear || isWithinOneYearAgo) return true;
  return false;
};

export const isMonthAgo = oneTarotHistory => {
  //'2024-01-13T19:44:59.476+00:00' 이런 형식(그리니치 시각)이었는데,
  const period = oneTarotHistory?.createdAt;
  // 현재 로컬 날짜
  const currentDate = new Date();
  // 한 달 전 로컬 날짜 계산
  //Sun Jan 14 2024 07:50:00 GMT+0900 (한국 표준시) 이런형식으로 찍힘
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  // 데이터가 저장된 날짜 (예시)
  const dataDate = new Date(period);
  // 데이터가 현재 날짜로부터 한 달 전인지 여부 판별
  const isWithinOneMonthAgo = dataDate > oneMonthAgo;
  return isWithinOneMonthAgo;
};

export const isWeekAgo = oneTarotHistory => {
  const period = oneTarotHistory?.createdAt;
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);
  const dataDate = new Date(period);
  const isWithinOneWeekAgo = dataDate > oneWeekAgo;
  return isWithinOneWeekAgo;
};

export const isDayAgo = oneTarotHistory => {
  const period = oneTarotHistory?.createdAt;
  const currentDate = new Date();
  const oneDayAgo = new Date(currentDate);
  oneDayAgo.setDate(currentDate.getDate() - 1);
  const dataDate = new Date(period);
  const isWithinOneDayAgo = dataDate > oneDayAgo;
  return isWithinOneDayAgo;
};
