const log = require("@/utils/logger.js");

const loggerMiddleware = (req, res, next) => {
  log(`${req.method} ${req.url}`);
  next();
};

module.exports = loggerMiddleware;
