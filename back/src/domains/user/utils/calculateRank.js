/**
 * 사용자의 타로 이용 통계를 기반으로 랭크를 계산하는 함수
 *
 * 기준:
 * - 구독 기능 및 광고제거 이용권(보통타로 무료 이용권)으로 본 회수는 제외
 * - 순수 이용권이나 광고로 본 회수만으로 랭크 업 가능
 *
 * 랭크 기준 (각 랭크마다 normal, deep, serious 회수를 동시에 만족해야 함):
 * - NEW: 기본 등급
 * - START: normal 8회 이상, deep 1회 이상, serious 1회 이상 (합계 10회 이상)
 * - COSMOS: normal 35회 이상, deep 12회 이상, serious 7회 이상 (합계 50회 이상)
 * - VIP: normal 70회 이상, deep 20회 이상, serious 15회 이상 (합계 100회 이상)
 *
 * 주의: normal은 광고로 접근 가능하므로 기준을 높게 설정하고,
 *      serious는 차별화를 위해 적절한 기준을 유지
 */

/**
 * 연도가 바뀌었는지 확인하고, 바뀌었으면 통계와 랭크를 초기화하고 누적 기록에 저장
 * @param {Object} userInfo - 사용자 정보 객체
 * @returns {Object} - 초기화가 필요한 경우 { shouldReset: true, updatedUserInfo: {...} }, 아니면 { shouldReset: false }
 */
function checkAndResetYearlyStats(userInfo) {
  const currentYear = new Date().getFullYear();
  const lastResetYear = userInfo?.lastStatsResetYear;

  // 처음 사용하는 경우: lastStatsResetYear를 현재 연도로 설정 (초기화는 하지 않음)
  if (lastResetYear === null || lastResetYear === undefined) {
    return {
      shouldReset: false,
      updatedUserInfo: {
        ...userInfo,
        lastStatsResetYear: currentYear,
      },
    };
  }

  // 연도가 바뀌지 않은 경우
  if (lastResetYear === currentYear) {
    return { shouldReset: false };
  }

  // 연도가 바뀌었으므로 초기화 필요
  const currentStats = userInfo?.tarotUsageStats || {
    free: 0,
    normal: 0,
    deep: 0,
    serious: 0,
  };
  const currentRank = userInfo?.isRanked || {
    VIP: false,
    COSMOS: false,
    START: false,
    NEW: true,
  };
  const history = userInfo?.tarotUsageStatsHistory || [];

  // 현재 연도의 기록을 누적 기록에 추가
  const newHistoryEntry = {
    year: lastResetYear,
    stats: { ...currentStats },
    rank: { ...currentRank },
  };

  // 중복 체크: 같은 연도의 기록이 이미 있으면 업데이트, 없으면 추가
  const existingIndex = history.findIndex(
    (entry) => entry.year === lastResetYear
  );
  if (existingIndex >= 0) {
    history[existingIndex] = newHistoryEntry;
  } else {
    history.push(newHistoryEntry);
  }

  // 통계와 랭크 초기화
  const resetStats = {
    free: 0,
    normal: 0,
    deep: 0,
    serious: 0,
  };
  const resetRank = {
    VIP: false,
    COSMOS: false,
    START: false,
    NEW: true,
  };

  return {
    shouldReset: true,
    updatedUserInfo: {
      ...userInfo,
      tarotUsageStats: resetStats,
      isRanked: resetRank,
      tarotUsageStatsHistory: history,
      lastStatsResetYear: currentYear,
    },
  };
}

function calculateRank(tarotUsageStats) {
  // 기본값 설정
  const stats = {
    free: 0,
    normal: 0,
    deep: 0,
    serious: 0,
    ...(tarotUsageStats || {}),
  };

  // 순수 이용권 + 광고로 본 회수 합계 계산
  // (구독 및 광고제거 이용권으로 본 회수는 이미 제외되어 있음)
  const totalCount = stats.free + stats.normal + stats.deep + stats.serious;

  // 랭크 결정 (각 랭크마다 normal, deep, serious 기준을 동시에 만족해야 함)
  let newRank = {
    VIP: false,
    COSMOS: false,
    START: false,
    NEW: true, // 기본값
  };

  // VIP: normal 70회 이상, deep 20회 이상, serious 15회 이상
  if (
    stats.normal >= 70 &&
    stats.deep >= 20 &&
    stats.serious >= 15 &&
    totalCount >= 100
  ) {
    newRank = { VIP: true, COSMOS: false, START: false, NEW: false };
  }
  // COSMOS: normal 35회 이상, deep 12회 이상, serious 7회 이상
  else if (
    stats.normal >= 35 &&
    stats.deep >= 12 &&
    stats.serious >= 7 &&
    totalCount >= 50
  ) {
    newRank = { VIP: false, COSMOS: true, START: false, NEW: false };
  }
  // START: normal 8회 이상, deep 1회 이상, serious 1회 이상
  else if (
    stats.normal >= 8 &&
    stats.deep >= 1 &&
    stats.serious >= 1 &&
    totalCount >= 10
  ) {
    newRank = { VIP: false, COSMOS: false, START: true, NEW: false };
  }

  return {
    newRank,
    totalCount,
  };
}

module.exports = { calculateRank, checkAndResetYearlyStats };
