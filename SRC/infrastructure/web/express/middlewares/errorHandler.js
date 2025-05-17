const logger  = require("../../utils/logger");
const { UserError } = require("../../../../business/error");

const errorHandler = (err, req, res, next) => {
  // Log su console e/o file
  logger.error(`[${req.method} ${req.originalUrl}] ${err.name}: ${err.message}`);
  logger.debug(err.stack); // utile per il debug

  // Errori conosciuti (UserError e derivati)
  if (err instanceof UserError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Errori di Multer (es. limite file)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large" });
  }

  // Errori inaspettati
  res.status(500).json({ error: "Internal server error" });
};

module.exports = { errorHandler, };