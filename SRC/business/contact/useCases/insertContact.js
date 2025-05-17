const { Contact } = require("../domain/contact");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../../infrastructure/web/services/emailService");
const logger = require("../../../infrastructure/web/utils/logger");
const jwt = require("../../../infrastructure/web/utils/jwtToken");
const { 
  EmailAlreadyInUseError,
  InvalidEmailSendingError,
  InvalidPasswordError,
 } = require("../../error");

class InsertContact {
    constructor(contactDAO) {
        this.contactDAO = contactDAO;
      }
  
    async execute({ email, password }) {
      logger.info(`Sign up use case started for user ${ email }`);

      const duplicate = await this.contactDAO.checkEmail(email);
      if (duplicate) throw new EmailAlreadyInUseError();
      if (password.length < 8) throw new InvalidPasswordError();
      
      let password_hash;
      let email_code;
      password_hash = await bcrypt.hash(password, 10);
      email_code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const generalContact = new Contact({
        email,
        password_hash,
        email_code,
    });
    
      const saveUser = await this.contactDAO.insert(generalContact);
      try{
        logger.info(`Attempting to send verification email to ${email}`);
        await sendEmail({
          to: email,
          subject: "Welcome to our platform",
          html: `Your verification code is: ${email_code}`
        });
        logger.info(`Verification email sent to ${email}`);
    }catch(err){
      logger.error('Error sending email, rollback user creation', { error: err.message });
      await this.contactDAO.deleteContact(saveUser.id, false);
      throw new InvalidEmailSendingError();
    }
  
      const jwtToken = jwt.generateHS256JWT(saveUser, process.env.JWT_SECRET);
      logger.info(`Sign up use case completed for user ${ email }` );
      return {
        jwt: jwtToken,
        contact: saveUser.publicData,
        message: "Check your email for the validation code"
      };

    }
  }

  module.exports = InsertContact;