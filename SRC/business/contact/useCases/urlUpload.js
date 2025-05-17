const UploadPinata = require("../../../infrastructure/web/services/ipfsUploader");
const jwt = require("../../../infrastructure/web/utils/jwtToken");
const logger = require("../../../infrastructure/web/utils/logger");
class UrlUpload{
    constructor(contactDAO){
        this.contactDAO=contactDAO;
    }

    async execute({payload, filePath}){
        logger.info(`Uploading file to IPFS for user ${payload.id}`);
        const ipfsUrl = await UploadPinata(filePath);
        await this.contactDAO.urlUpload(payload.id, ipfsUrl);
        logger.info(`File uploaded to IPFS: ${ipfsUrl}`);
        const user_updated = await this.contactDAO.getUser(payload);
        const jwtToken = jwt.generateHS256JWTexp(user_updated, process.env.JWT_SECRET);
        if (user_updated.role === "company") {
        return{
            jwt: jwtToken,
            user: user_updated.publicDataCompany,
            message: "Profile image uploaded successfully",
        }
        }
        return{
            jwt: jwtToken,
            user: user_updated.publicDataUser,
            message: "Profile image uploaded successfully",
        }
    }
}
module.exports = UrlUpload;