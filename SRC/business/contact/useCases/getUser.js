const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");

class GetUser{
    constructor(contactDAO){
        this.contactDAO = contactDAO;
    }

    async execute({payload}){
        logger.info(`GetUser use case for user ${payload.id}`);
        const user = await this.contactDAO.getUser(payload)
        logger.info(`GetUser use case success for user ${user.id}`);
        const jwtToken = jwt.generateHS256JWTexp(user, process.env.JWT_SECRET);
        if(user.role === "company"){
            return{
                jwt: jwtToken,
                user: user.publicDataCompany,
            }
        }
        return{
            jwt: jwtToken,
            user: user.publicDataUser,
        }
    }
}

module.exports = GetUser;