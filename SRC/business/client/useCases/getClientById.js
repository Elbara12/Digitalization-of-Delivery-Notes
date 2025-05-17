const logger = require('../../../infrastructure/web/utils/logger');

class GetClientById {
  constructor(clientDAO) {
    this.clientDAO = clientDAO;
  }

  async execute({ clientId, userId }) {
    logger.info('GetClientById request received for Client');
    const route= true;
    const client = await this.clientDAO.getClientById(clientId, route, userId);
    logger.info('GetClientById request completed for Client');
    return{
        client: client.publicData,
        message: "Client retrieved successfully"
    }
  }
}

module.exports = GetClientById;