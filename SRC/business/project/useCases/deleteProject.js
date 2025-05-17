const logger = require("../../../infrastructure/web/utils/logger");

class DeleteProject{
    constructor(projectDAO) {
        this.projectDAO = projectDAO;
    }

    async execute({id, soft = true, payload}) {
        logger.info(`Deleting project with id: ${id}`);
        await this.projectDAO.deleteProject(id, soft, payload);
        if (soft) {
            logger.info(`Project with id: ${id} soft deleted`);
            return {
                Message: "Project soft deleted",
            };
        }
        logger.info(`Project with id: ${id} hard deleted`);
        return {
            Message: "Project deleted",
        };
    }
}


module.exports = DeleteProject;