const localTimeToUTC = (
  zd = 0, // 현노드 실행 환경의 타임존 기준 UTC offset(단위: 시간)
  year,
  month,
  day,
  hour = 0,
  min = 0,
  sec = 0
) => {
  
  // 2. 입력받은 현지(로컬) 시각을 UTC 기준으로 잡아줌
  //    month: 1~12 → JS는 0-based(0=1월)
  const local = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
  // 3. 타임존 오프셋만큼 밀어서 UTC 시각 구하기
  return new Date(local.getTime() - zd * 60 * 60 * 1000).toISOString();
};

module.exports = localTimeToUTC;



// 현재 내 환경의 타임존을 자동 판별하여 "2025-08-26 13:45:20" 로컬 시각이
// UTC로 언제인지 알려줌
