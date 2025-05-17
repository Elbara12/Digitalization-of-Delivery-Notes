const logger = require('../utils/logger');
const InsertProject = require('../../../business/project/useCases/insertProject');
const Update = require('../../../business/project/useCases/update');
const GetProjects = require('../../../business/project/useCases/getProjects');
const GetProjectById = require('../../../business/project/useCases/getProjectById');
const DeleteProject = require('../../../business/project/useCases/deleteProject');
const GetArchived = require('../../../business/project/useCases/getArchived');
const RestoreProject = require('../../../business/project/useCases/restoreProject');

class ProjectController {
    constructor(projectDAO) {
      this.projectDAO = projectDAO;
    }

    async registration(req){
        logger.info('SignUp request received for Project');
        console.log(typeof req.user.id);
        try {
          const insertProject = new InsertProject(this.projectDAO);
          const result = await insertProject.execute({payload:req.user,project:req.body});
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
        logger.info('AssociateProject request received for Project');
        try {
          const projectId = parseInt(req.params.projectId.replace(':', ''), 10);
          const update = new Update(this.projectDAO);
          const result = await update.execute({payload:req.user, projectId, project:req.body});
          return { statusCode: 201, payload: result };
        } catch (error) {
          logger.error('Error in associateProject:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getProjects(req){
        logger.info('GetProject request received for Project');
        try {
          const getProject = new GetProjects(this.projectDAO);
          const result = await getProject.execute({payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getProject:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getProjectById(req){
        logger.info('GetProjectById request received for Project');
        try {
          const projectId = parseInt(req.params.projectId.replace(':', ''), 10);
          const getProject = new GetProjectById(this.projectDAO);
          const result = await getProject.execute({ projectId, payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getProject:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async delete(req) {
        logger.info('Delete project request received');
        try {
          const id = parseInt(req.params.projectId.replace(':', ''), 10);
          const soft =req.query.soft !== "false";
          const deleteProject = new DeleteProject(this.projectDAO);
          const result = await deleteProject.execute({id, soft: soft, payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in delete project:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getArchived(req){
        logger.info('GetArchived request received for Project');
        try {
          const getArchived = new GetArchived(this.projectDAO);
          const result = await getArchived.execute({payload:req.user});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getProject:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async restoreArchived(req){
        logger.info('RestoreArchived request received for Project');
        try {
          const projectId = parseInt(req.params.projectId.replace(':', ''), 10);
          const restoreProject = new RestoreProject(this.projectDAO);
          const result = await restoreProject.execute({projectId,userId:req.user.id});
          return { statusCode: 200, payload: result };
        } catch (error) {
          logger.error('Error in getProject:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

}

module.exports = { ProjectController } ;