const logger = require("../../../infrastructure/web/utils/logger");

class GetArchived{
    constructor(projectDAO) {
        this.projectDAO = projectDAO;
    }

    async execute({ payload }) {
        logger.info("GetArchived request received for Project");
        const result = await this.projectDAO.getArchived(payload.id);
        logger.info("GetArchived request completed for Project");
        return {
            projects: result,
            message: "Archived projects retrieved successfully"
        };
    }
}

module.exports = GetArchived;