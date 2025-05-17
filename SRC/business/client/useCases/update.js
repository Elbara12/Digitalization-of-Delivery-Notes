const logger= require("../../../infrastructure/web/utils/logger");

class Update {
    constructor(clientDAO) {
        this.clientDAO = clientDAO;
    }

    async execute({ payload, client }) {
        logger.info(`Update use case started for user ${payload.id}`);
        await this.clientDAO.updateClient(client, payload);
        logger.info(`Client ${client.client_id} updated by user ${payload.id}`);

        const clientData = await this.clientDAO.getClientById(client.client_id);
        return {
            client: clientData.publicData,
            message: "Client updated successfully",
        };
    }
}

module.exports = Update;