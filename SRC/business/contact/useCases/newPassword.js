const bcrypt = require("bcrypt");
const logger = require("../../../infrastructure/web/utils/logger");
const {
    InvalidRecoveryCodeError,
    InvalidPasswordError,
}= require("../../error")

class NewPassword{
    constructor(contactDAO){
        this.contactDAO=contactDAO;
    }

    async execute({user}){
        logger.info(`NewPassword use case started for user: ${user.email}`);
        if(user.password.length < 8) throw new InvalidPasswordError();
        const password_hash = await bcrypt.hash(user.password, 10);
        const code_valid = await this.contactDAO.newPassword(user.email,user.recoveryCode,password_hash);
        if(code_valid){
            logger.info(`Password changed for user: ${user.email}`);
            return {
                message: "Password changed",
            }
        }
        else{
            logger.error(`Invalid recovery code for user: ${user.email}`);
            throw new InvalidRecoveryCodeError();
        }
    }
}

module.exports = NewPassword;