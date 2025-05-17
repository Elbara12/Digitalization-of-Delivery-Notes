const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");

class OnBoardingUser {
  constructor( contactDAO ) {
    this.contactDAO = contactDAO;
  }

  async execute({payload,contact}) {
    logger.info(`OnBoardingUser use case started for ${payload.email}`);
    await this.contactDAO.onBoardingUser(payload,contact);
    logger.info(`OnBoardingUser use case finished for ${payload.email}`);
    const update_contact = await this.contactDAO.getUser(payload);
    const jwtToken = jwt.generateHS256JWTexp(update_contact, process.env.JWT_SECRET);
    return {
      jwt:jwtToken,
      user: update_contact.publicDataUser,
    }
  }
}

module.exports = OnBoardingUser;