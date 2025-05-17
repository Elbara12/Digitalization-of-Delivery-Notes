const logger= require("../../../infrastructure/web/utils/logger");

class Update{
    constructor(projectDAO) {
        this.projectDAO = projectDAO;
    }

    async execute({ payload, projectId, project }) {
        logger.info(`Update use case started for project ${project.name}`);
        await this.projectDAO.UpdateProject(project, projectId, payload);
        logger.info(`Project ${project.name} updated successfully`);
        const projectData = await this.projectDAO.getProjectById(projectId);
        return {
            project: projectData.publicData,
            message: "Project updated successfully",
        };
    }
}

module.exports = Update;