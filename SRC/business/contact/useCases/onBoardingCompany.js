const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");

class OnBoardingCompany {
  constructor( contactDAO ) {
    this.contactDAO = contactDAO;
  }

  async execute({payload, contact}) {
    logger.info(`OnBoardingCompany use case started for user: ${payload.id}`);
    await this.contactDAO.onBoardingCompany(payload,contact);
    logger.info(`OnBoardingCompany use case completed for user: ${payload.id}`);
    const update_contact = await this.contactDAO.getUser(payload);
    const jwtToken = jwt.generateHS256JWTexp(update_contact, process.env.JWT_SECRET);
    return {
      jwt: jwtToken,
      user:update_contact.publicDataCompany,
    }
}
};

module.exports = OnBoardingCompany;