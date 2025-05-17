const InsertContact = require('../../../business/contact/useCases/insertContact');
const ValidateMail = require('../../../business/contact/useCases/validateMail');
const ValidateLogin = require('../../../business/contact/useCases/validateLogin');
const OnBoardingCompany = require('../../../business/contact/useCases/onBoardingCompany');
const OnBoardingUser = require('../../../business/contact/useCases/onBoardingUser');
const UrlUpload = require('../../../business/contact/useCases/urlUpload');
const DeleteContact = require('../../../business/contact/useCases/deleteContact');
const GetUser = require('../../../business/contact/useCases/getUser');
const PasswordRecovery = require('../../../business/contact/useCases/passwordRecovery');
const NewPassword = require('../../../business/contact/useCases/newPassword');
const Summarize = require('../../../business/contact/useCases/summarize');

const  logger  = require('../utils/logger');

class UserController {
    constructor(contactDAO) {
      this.contactDAO = contactDAO;
    }
  
    async registration(req) {
        logger.info('SignUp request received');
        try {
          const insertContact = new InsertContact(this.contactDAO);
          const result = await insertContact.execute(req.body);
          return { statusCode: 201, payload: result };
        } catch (error) {
          logger.error('Error in signUp:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
      }

    async validation(req) {
        logger.info('Validation mail request received');
        try {
          const validateMail = new ValidateMail(this.contactDAO);
          const result = await validateMail.execute({payload: req.user, email_code: req.body.email_code});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in validation mail:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
      }

    async login(req) {
        logger.info('Login request received');
        try {
          const validateLogin = new ValidateLogin(this.contactDAO);
          const result = await validateLogin.execute({contact:req.body});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in login:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
      }

    async onBoardingCompany(req) {
        logger.info('Onboarding company request received');
        try {
          const onBoardingCompany = new OnBoardingCompany(this.contactDAO);
          const result = await onBoardingCompany.execute({payload:req.user, contact: req.body});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in onboarding company:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async onBoardingUser(req) {
        logger.info('Onboarding user request received');
        try {
          const onBoardingUser = new OnBoardingUser(this.contactDAO);
          const result = await onBoardingUser.execute({payload:req.user, contact: req.body});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in onboarding user:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async urlUpload(req) {
        logger.info("Profile image upload requested");
        try {
          const urlUpload = new UrlUpload(this.contactDAO);
          const result = await urlUpload.execute({payload: req.user, filePath: req.file.path});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in upload URL:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getUser(req) {
        logger.info('Get user request received');
        try {
          const getUser = new GetUser(this.contactDAO);
          const result = await getUser.execute({payload: req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in get user:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async delete(req) {
        logger.info('Delete user request received');
        try {
          const soft =req.query.soft !== "false";
          const deleteContact = new DeleteContact(this.contactDAO);
          const result = await deleteContact.execute({id:req.user.id, soft: soft});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in delete user:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async recovery(req) {
        logger.info('Password recovery request received');
        try {
          const passwordRecovery = new PasswordRecovery(this.contactDAO);
          const result = await passwordRecovery.execute({mail: req.body.email});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in password recovery:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async newPassword(req) {
        logger.info('New password request received');
        try {
          const newPassword = new NewPassword(this.contactDAO);
          const result = await newPassword.execute({user: req.body});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in new password:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async summarize(req) {
        logger.info('Summarize request received');
        try {
          const summarize = new Summarize(this.contactDAO);
          const result = await summarize.execute();
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in summarize:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }
    
}

module.exports = { UserController } ;