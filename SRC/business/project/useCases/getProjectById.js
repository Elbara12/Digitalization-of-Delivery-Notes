const logger = require('../../../infrastructure/web/utils/logger');

class GetProjectById {
  constructor(projectDAO) {
    this.projectDAO = projectDAO;
  }

  async execute({ projectId,payload }) {
    logger.info('GetProjectById request received for Project');
    const route= true;
    const project = await this.projectDAO.getProjectById(projectId,route, payload.id);
    logger.info('GetProjectById request completed for Project');
    return{
        project: project.publicData,
        message: "Project retrieved successfully"
    }
  }
}

module.exports = GetProjectById;