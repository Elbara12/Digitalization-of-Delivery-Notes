const { Contact } = require("../domain/contact");
const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");

class ValidateLogin {
  constructor(contactDAO) {
    this.contactDAO = contactDAO;
  }

  async execute({contact}) {
    logger.info(`Validating login for contact: ${contact.email}`);
    await this.contactDAO.validateLogin(contact);
    const update = await this.contactDAO.getUser(contact);
    const jwtToken = jwt.generateHS256JWTexp(update, process.env.JWT_SECRET);
    logger.info(`Login successful for ${update.id}`);
    return {
        jwt: jwtToken,
        user: update.publicData,
        message: "Login successful",
    }
  }
}

module.exports = ValidateLogin;
