const { sendEmail } = require("../../../infrastructure/web/services/emailService");
const logger = require("../../../infrastructure/web/utils/logger");
const {
    InvalidEmailSendingError,
} = require("../../error");

class PasswordRecovery{
    constructor(contactDAO){
        this.contactDAO = contactDAO;
    }

    async execute({mail}){
        logger.info("Password recovery process started");
        const codeRecovery = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        await this.contactDAO.passwordRecovery(mail, codeRecovery);
        logger.info("Password recovery code generated and stored in the database");
        try {
            await sendEmail({
                to: mail,
                subject: "Password Recovery",
                html: `<p>Log with this code and yout mail at http://localhost:3000/api/user/recovery/newpassword.</p>
                            <p>In the body, insert your mail, coderecovery(recived via mail) and the new password</p>
                            <p>Recovery code:${codeRecovery}</p>`
                });
            logger.info("Password recovery email sent successfully");
        }catch (error) {
            logger.error("Error sending email: ", error);
            throw new InvalidEmailSendingError();
        }
        return { message: "Check your email for the recovery code" };
    };
}


module.exports= PasswordRecovery;