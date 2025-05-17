const logger = require("../../../infrastructure/web/utils/logger");
const { Client } = require("../domain/client");
const {
    CifAlreadyInUseError,
}= require("../../error");

class InsertClient{
    constructor(clientDAO){
        this.clientDAO = clientDAO;
    }

    async execute({client, payload}){
        logger.info(`Insert client use case started for client ${client.name}`);
        const duplicate = await this.clientDAO.checkCif(client.cif, payload.id);
        if (duplicate) {
            logger.error(`CIF ${client.cif} already in use for user ${payload.id}`);
            throw new CifAlreadyInUseError();
        }
        const ClientData = new Client ({
            name: client.name,
            CIF: client.cif,
            address: client.address,
            user_id: payload.id
        });

        const saveClient = await this.clientDAO.insert(ClientData);
        logger.info(`Client ${client.name} inserted successfully`);
        return {
            client: saveClient.publicData,
            message: "Client created successfully",
          };
    }
}

module.exports = InsertClient;