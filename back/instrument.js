const Sentry = require("@sentry/node");

const sentryDsn = process.env.SENTRY_DSN;
const sendDefaultPii = process.env.SENTRY_SEND_DEFAULT_PII !== "false";

Sentry.init({
  dsn: sentryDsn,
  sendDefaultPii,
});