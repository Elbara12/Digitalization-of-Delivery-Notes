const logger = require("../../../infrastructure/web/utils/logger");

class DeleteContact{
    constructor(contactDAO){
        this.contactDAO = contactDAO;
    }
    
    async execute({id, soft = true}){
        logger.info(`Deleting contact with id: ${id}`);
        await this.contactDAO.deleteContact(id, soft);
        if (soft) {
            logger.info(`Contact with id: ${id} soft deleted`);
            return {
                Message: "Contact soft deleted",
            };
        }
        logger.info(`Contact with id: ${id} hard deleted`);
        return {
            Message: "Contact deleted",
        };
    }
}

module.exports = DeleteContact;