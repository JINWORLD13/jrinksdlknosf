// AdMob 광고 유닛 ID - 환경변수에서 로드 (실제 값은 .env에 설정)
// AdMob ad unit IDs - loaded from env (set real values in .env)

const env = import.meta.env;

export const AD_UNIT_IDS = {
  BANNER: env.VITE_ADMOB_BANNER_ID || '',
  INTERSTITIAL_TAROT1: env.VITE_ADMOB_INTERSTITIAL_TAROT1_ID || '',
  INTERSTITIAL_TAROT2: env.VITE_ADMOB_INTERSTITIAL_TAROT2_ID || '',
  REWARD: env.VITE_ADMOB_REWARD_ID || '',
  REWARD_INTERSTITIAL: env.VITE_ADMOB_REWARD_INTERSTITIAL_ID || '',
};

// AdSense(웹) 퍼블리셔 ID / 슬롯 ID - 환경변수에서 로드
export const ADSENSE_IDS = {
  CLIENT: env.VITE_ADSENSE_CLIENT || '',
  SLOT: env.VITE_ADSENSE_SLOT || '',
};

// 웹 결제 상품 ID - 환경변수에서 로드
export const PRODUCT_ID_NORMAL_TAROT_FREE_3D =
  env.VITE_PRODUCT_ID_NORMAL_TAROT_FREE_3D || '';
