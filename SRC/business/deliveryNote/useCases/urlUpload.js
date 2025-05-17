const logger = require("../../../infrastructure/web/utils/logger");
const UploadPinata = require("../../../infrastructure/web/services/ipfsUploader");

class UrlUpload{
    constructor(noteDAO){
        this.noteDAO=noteDAO;
    }

    async execute({payload, noteId, filePath}){
        logger.info(`Uploading file to IPFS for note ${noteId}`);
        const ipfsUrl = await UploadPinata(filePath);
        await this.noteDAO.urlUpload(payload.id, noteId, ipfsUrl);
        logger.info(`File uploaded to IPFS: ${ipfsUrl}`);
        return { message: "Delivery note signed", Url: ipfsUrl };
        
    }
}

module.exports = UrlUpload;