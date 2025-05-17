const logger = require("../../utils/logger");

function requestLogger(req, res, next) {
  const safeBody = { ...req.body };
if (safeBody.password) safeBody.password = "[REDACTED]";
if (safeBody.newPassword) safeBody.newPassword = "[REDACTED]";
if (safeBody.token) safeBody.token = "[REDACTED]";
if (safeBody.email_code) safeBody.email_code = "[REDACTED]";
logger.info(`${req.method} ${req.originalUrl} - Body: ${JSON.stringify(safeBody)} - Query: ${JSON.stringify(req.query)}`);
  next();
}

module.exports = requestLogger;