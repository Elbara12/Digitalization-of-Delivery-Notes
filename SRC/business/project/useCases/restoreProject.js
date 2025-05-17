const logger = require('../../../infrastructure/web/utils/logger');

class RestoreArchived{
    constructor(projectDAO) {
        this.projectDAO = projectDAO;
    }

    async execute({ projectId, userId }) {
        logger.info('RestoreArchived request received for Project');
        await this.projectDAO.restoreArchived(projectId, userId);
        logger.info('RestoreArchived request completed for Project');
        return {
            message: "Project restored successfully"
        };
    }
}

module.exports = RestoreArchived;