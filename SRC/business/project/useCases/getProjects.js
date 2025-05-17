const logger = require("../../../infrastructure/web/utils/logger");

class GetProjects{
    constructor(projectDAO) {
            this.projectDAO = projectDAO;
        }
    
        async execute({payload}) {
                logger.info('GetProject use case executed');
                const result = await this.projectDAO.getProjects(payload.id);
                logger.info('GetProject use case executed successfully');
                return {
                    projects: result,
                    message: "Projects retrieved successfully"
                }
        }
}

module.exports = GetProjects;