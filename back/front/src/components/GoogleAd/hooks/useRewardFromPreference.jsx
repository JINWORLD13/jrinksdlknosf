import { Capacitor } from '@capacitor/core';
import { isProductionMode } from '@/utils/constants';
import { isNormalAccount } from '../../../lib/user/isNormalAccount.js';
import {
  getAdsFree,
  getRewardForPreference,
  setAdsFree,
  useRewardForPreference,
} from '../../../utils/storage/tokenPreference';

const isNative = Capacitor.isNativePlatform();

export const useRewardFromPreference = async ({
  userInfo,
  selectedAdType,
  selectedTarotMode,
  isVoucherModeOn,
  setAdmobReward,
}) => {
  //! Preference에서 바로 reward 제거
  // console.log('***************selectedAdType : ', selectedAdType);
  //? 광고를 보지 않을때 (이용권 혹은 isAdsFree) selectedAdType는 0임....
  if (
    (selectedAdType === 0 || selectedAdType === 2 || selectedAdType === 4) &&
    selectedTarotMode === 2 &&
    isNative &&
    !isVoucherModeOn
  ) {
    //? await getAdsFree()가 true일때 아닐때 전부 티켓 받으니깐... 조건문 없음
    let type =
      isProductionMode && isNormalAccount(userInfo) ? 'Voucher' : 'coins';
    let amount = isProductionMode && isNormalAccount(userInfo) ? 1 : 10;
    await useRewardForPreference(type, amount, userInfo?.email);
    const rewardOfUser = await getRewardForPreference(type, userInfo?.email);
    setAdmobReward(prev => {
      if (rewardOfUser === null) return 0;
      return rewardOfUser;
    });
  }
};
