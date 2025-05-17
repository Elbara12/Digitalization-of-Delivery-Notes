const logger = require("../../../infrastructure/web/utils/logger");

class GetClient{
    constructor(clientDAO) {
        this.clientDAO = clientDAO;
    }

    async execute({payload}) {
            logger.info('GetClient use case executed');
            const result = await this.clientDAO.getClients(payload.id);
            logger.info('GetClient use case executed successfully');
            return {
                clients: result,
                message: "Clients retrieved successfully"
            }
    }
}

module.exports = GetClient;