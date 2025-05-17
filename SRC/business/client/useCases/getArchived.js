const logger = require("../../../infrastructure/web/utils/logger");

class GetArchived{
    constructor(clientDAO) {
        this.clientDAO = clientDAO;
    }

    async execute({ payload }) {
        logger.info("GetArchived request received for Client");
        const result = await this.clientDAO.getArchived(payload.id);
        logger.info("GetArchived request completed for Client");
        return {
            clients: result,
            message: "Archived clients retrieved successfully"
        };
    }
}

module.exports = GetArchived;