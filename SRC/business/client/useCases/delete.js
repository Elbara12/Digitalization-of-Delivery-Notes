const logger = require("../../../infrastructure/web/utils/logger");

class Delete{
    constructor(clientDAO) {
        this.clientDAO = clientDAO;
    }

    async execute({id, soft = true}){
        logger.info(`Deleting client with id: ${id}`);
        await this.clientDAO.deleteClient(id, soft);
        if (soft) {
            logger.info(`Client with id: ${id} soft deleted`);
            return {
                Message: "Client soft deleted",
            };
        }
        logger.info(`Client with id: ${id} hard deleted`);
        return {
            Message: "Client deleted",
        };
    }
}


module.exports = Delete;