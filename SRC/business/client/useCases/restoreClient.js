const logger = require('../../../infrastructure/web/utils/logger');

class RestoreArchived{
    constructor(clientDAO) {
        this.clientDAO = clientDAO;
    }

    async execute({ clientId ,userId}) {
        logger.info('RestoreArchived request received for Client');
        await this.clientDAO.restoreArchived(clientId,userId);
        logger.info('RestoreArchived request completed for Client');
        return {
            message: "Client restored successfully"
        };
    }
}

module.exports = RestoreArchived;