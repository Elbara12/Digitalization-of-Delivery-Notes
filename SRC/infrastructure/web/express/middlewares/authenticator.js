const jsonwebtoken = require("jsonwebtoken");
const logger = require("../../utils/logger");
const {
  UserDisabledError,
  InvalidEmailValidationError,
  EmailAlreadyValidatedError,
  InvalidRouteCompanyError,
  InvalidRouteUserError,
  InvalidJWTError,
  MissingJWTError,
}= require("../../../../business/error")

function authenticator(req, res, next) {
  const openPaths = [
    { path: "/api/user/register", method: "POST" },
    { path: "/api/user/login", method: "POST" },
    { path: "/api/user/recovery", method: "POST" },
    { path: "/api/user/recovery/newpassword", method: "POST" },
    { path: "/api/user/summarize", method: "GET" },

    { path: "/api-docs", method: "GET" },
    { path: "/api-docs/", method: "GET" },
    { path: "/api-docs/swagger-ui.css", method: "GET" },
    { path: "/api-docs/swagger-ui-bundle.js", method: "GET" },
    { path: "/api-docs/swagger-ui-standalone-preset.js", method: "GET" },
    { path: "/api-docs/swagger-ui-init.js", method: "GET" },
    { path: "/favicon.ico", method: "GET" },
    { path: "/", method: "GET" },
  ];
  const isPublicRoute = openPaths.some(
    route => route.path === req.originalUrl && route.method === req.method
  );
  
  if (isPublicRoute) {
    return next(); // salta autenticazione
  }

  const jwt = req.headers.authorization?.split(" ")?.[1];
  if (!jwt) {
    logger.error(`[AUTH] Missing JWT for ${req.method} ${req.originalUrl}`);
    throw new MissingJWTError();
  }
  let decoded;
  try {
    decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);

  } catch (err) {
    logger.error(`[AUTH] Invalid JWT for ${req.method} ${req.originalUrl}`, { error: err.message });
    throw new InvalidJWTError();
  }
    req.user = decoded;
    if (decoded.status !== 'active' && decoded.status !== 'tobevalidated') {
      logger.error(`[AUTH] Account deactivated or deleted(soft) for ${req.method} ${req.originalUrl}`);
      throw new UserDisabledError();
    }


    const isValidationRoute = req.originalUrl === "/api/user/validation";
    if (decoded.emailstatus === '0' && isValidationRoute) {
      return next(); // utente non ancora validato, ma va bene su /validation
    }
    if (decoded.emailstatus === '1' && isValidationRoute) {
      logger.error(`[AUTH] Email already validated for ${req.method} ${req.originalUrl}`);
      throw new EmailAlreadyValidatedError();
    }

    if (decoded.emailstatus === '0') {
      logger.error(`[AUTH] JWT old: email may not validated for ${req.method} ${req.originalUrl}`);
      throw new InvalidEmailValidationError();
    }
    if (decoded.role === 'company' &&  req.originalUrl === "/api/user/register") {
      logger.error(`[AUTH] Invalid route for company user for ${req.method} ${req.originalUrl}`);
      throw new InvalidRouteCompanyError();
    }
    if (decoded.role === 'personal_user' &&  req.originalUrl === "/api/user/company") {
      logger.error(`[AUTH] Invalid route for personal user for ${req.method} ${req.originalUrl}`);
      throw new InvalidRouteUserError();
    }

    // emailstatus === 1, utente validato → tutto ok
    next();
}

module.exports = {
  authenticator,
};