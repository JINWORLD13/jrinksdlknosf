import { makeApiRequest } from './api.jsx';

export const referralApi = {
  claimReferral: async referrerId => {
    return await makeApiRequest(
      'post',
      '/referral/claim',
      { referrerId },
      null,
      'claimReferral'
    );
  },
};

























