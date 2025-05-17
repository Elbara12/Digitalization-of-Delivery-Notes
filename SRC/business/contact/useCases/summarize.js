const logger = require('../../../infrastructure/web/utils/logger');

class Summarize{
    constructor(contactDAO){
        this.contactDAO = contactDAO;
    }

    async execute(){
        logger.info("Summarizing contacts...");
        const summary = await this.contactDAO.summarize();
        logger.info("Summary completed");
        return summary;
    }
}

module.exports = Summarize;