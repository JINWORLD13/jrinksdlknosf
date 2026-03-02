/**
 * 백엔드 API 라우트 prefix (env 기반). env 키는 경로 유추 불가.
 */
const routes = {
  tarot: process.env.COSMOS_R01,
  authenticate: process.env.COSMOS_R02,
  user: process.env.COSMOS_R03,
  admin: process.env.COSMOS_R04,
  payments: process.env.COSMOS_R05,
  google: process.env.COSMOS_R06,
  version: process.env.COSMOS_R07,
  referral: process.env.COSMOS_R08,
  health: process.env.COSMOS_R09,
  appAdsTxt: process.env.COSMOS_R10,
  adsTxt: process.env.COSMOS_R11,
  robotsTxt: process.env.COSMOS_R12,
};

const apiPrefixes = [
  routes.tarot,
  routes.authenticate,
  routes.user,
  routes.admin,
  routes.payments,
  routes.google,
  routes.version,
  routes.referral,
  routes.health,
].filter(Boolean);

function isApiPath(requestPath) {
  return apiPrefixes.some((prefix) => requestPath === prefix || requestPath.startsWith(prefix + "/"));
}

function getHealthPaths() {
  const h = routes.health;
  return h ? [h, `/ko${h}`, `/ja${h}`, `/en${h}`] : [];
}

module.exports = {
  routes,
  isApiPath,
  getHealthPaths,
};
