const { Contact } = require("../domain/contact");
const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");

class ValidateMail {
  constructor(contactDAO) {
    this.contactDAO = contactDAO;
  }
  async execute({payload, email_code}) {
    logger.info(`Validate email for user ${ payload.email }`);

    await this.contactDAO.validateMail(payload, email_code);
    const update = await this.contactDAO.getUser(payload);
    const jwtToken = jwt.generateHS256JWTexp(update, process.env.JWT_SECRET);
    logger.info(`Validation email completed for user ${ payload.email }`);
    return {
        jwt: jwtToken,
        contact: update.publicData,
        message: "Email validated successfully",
      };
    
  }
}

module.exports = ValidateMail;