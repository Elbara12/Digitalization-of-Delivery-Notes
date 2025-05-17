const logger = require("../../../infrastructure/web/utils/logger");
const { Project } = require("../domain/project");
const {
    ProjectAlreadyExistsError,
} = require("../../error");

class InsertProject{
    constructor(projectDAO){
        this.projectDAO = projectDAO;
    }

    async execute({payload,project}){
        logger.info(`Insert project use case started for project ${project.name}`);
        const duplicate = await this.projectDAO.checkPrj(project.name, project.email);
        if (duplicate) {
            logger.error(`Project ${project.name} already exists`);
            throw new ProjectAlreadyExistsError();
        }
        const ProjectData = new Project ({
            name: project.name,
            email: project.email,
            address: project.address,
            userId: payload.id,
            clientId: project.clientId
        });

        const saveProject = await this.projectDAO.insert(ProjectData);
        logger.info(`Project ${project.name} inserted successfully`);
        return {
            project: saveProject.publicData,
            message: "Project created successfully",
          };
    }
}

module.exports = InsertProject;