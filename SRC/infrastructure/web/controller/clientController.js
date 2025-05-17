const logger = require('../utils/logger');
const Update = require("../../../business/client/useCases/update");
const InsertClient = require("../../../business/client/useCases/insertClient");
const GetClient = require("../../../business/client/useCases/getClient");
const GetClientById = require("../../../business/client/useCases/getClientById");
const Delete = require("../../../business/client/useCases/delete");
const GetArchived = require("../../../business/client/useCases/getArchived");
const RestoreClient = require("../../../business/client/useCases/restoreClient");

class ClientController {
    constructor(clientDAO) {
      this.clientDAO = clientDAO;
    }

    async registration(req){
        logger.info('SignUp request received for Client');
        try {
          const insertClient = new InsertClient(this.clientDAO);
          const result = await insertClient.execute({client:req.body, payload:req.user});
          return { statusCode: 201, payload: result };
        } catch (error) {
          logger.error('Error in signUp:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async update(req){
        logger.info(`Update request received for Client: ${req.user.id}`);
        try {
          const update = new Update(this.clientDAO);
          const result = await update.execute({payload:req.user, client:req.body});
          return { statusCode: 201, payload: result };
        } catch (error) {
          logger.error('Error in Update:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getClient(req){
        logger.info('GetClient request received for Client');
        try {
          const getClient = new GetClient(this.clientDAO);
          const result = await getClient.execute({payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getClient:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getClientById(req){
        logger.info('GetClientById request received for Client');
        try {
          const clientId = parseInt(req.params.clientId.replace(':', ''), 10);
          const getClient = new GetClientById(this.clientDAO);
          const result = await getClient.execute({ clientId, userId: req.user.id });
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getClient:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async delete(req) {
        logger.info('Delete client request received');
        try {
          const id = parseInt(req.params.clientId.replace(':', ''), 10);
          const soft =req.query.soft !== "false";
          const deleteClient = new Delete(this.clientDAO);
          const result = await deleteClient.execute({id, soft: soft});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in delete client:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getArchived(req){
        logger.info('GetArchived request received for Client');
        try {
          const getArchived = new GetArchived(this.clientDAO);
          const result = await getArchived.execute({payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getArchived:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async restoreArchived(req){
        logger.info('RestoreArchived request received for Client');
        try {
          const clientId = parseInt(req.params.clientId.replace(':', ''), 10);
          const restoreClient = new RestoreClient(this.clientDAO);
          const result = await restoreClient.execute({clientId, userId: req.user.id});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getClient:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

}

module.exports = { ClientController } ;