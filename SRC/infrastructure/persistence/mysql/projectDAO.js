const pool = require('./db');
const logger = require("../../web/utils/logger");
const { Project } = require("../../../business/project/domain/project")
const {
  InvalidDatabaseError,
  ProjectNotFoundError,
  NotAuthorizedError,
  ProjectArchivedError,
  ProjectAlreadyExistsError,
  ProjectNotArchivedError,

}= require("../../../business/error");

class projectDAO { 
    constructor() {
      this.init();
    }
  
    async init() {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            user_id INT,
            client_id INT,
            archived BOOLEAN NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
          )
        `);
        logger.info("Table 'projects' created or already exists");
      } catch (err) {
        logger.error("Error creating table 'projects':", err);
        throw new InvalidDatabaseError();
      }
    }

    async insert(project){
      const [result] = await pool.query(
          'INSERT INTO projects (name, email, address, user_id, client_id, archived) VALUES (?, ?, ?, ?, ?, ?)',
          [project.name, project.email, JSON.stringify(project.address), project.userId, project.clientId, project.archived]
      );

      project.id= result.insertId;
      return project;
  }

  async checkPrj(name, email){
      const [rows] = await pool.query(
          'SELECT 1 FROM projects WHERE name = ? AND email = ?',
          [name, email]
      );
      return rows.length > 0;
  }

  async UpdateProject(project, projectId, payload) {
      const [[existing]] = await pool.query(
          'SELECT * FROM projects WHERE id = ? AND client_id = ?',
          [projectId, project.clientId]
      );
      if (!existing) throw new ProjectNotFoundError();
      if (existing.user_id !== payload.id) throw new NotAuthorizedError();
      if (existing.archived === 1) throw new ProjectArchivedError();

      const [duplicates] = await pool.query(
        'SELECT 1 FROM projects WHERE name = ? AND user_id = ? AND id != ?',
        [project.name, payload.id, projectId]
      );

      if (duplicates.length > 0) {
        throw new ProjectAlreadyExistsError("Project with this name already exists");
      }
      
      const [result] = await pool.query(
          'UPDATE projects SET name = ?, email = ?, address = ?, client_id = ? WHERE id = ? AND archived = 0 AND user_id = ?',
          [project.name, project.email, JSON.stringify(project.address), project.clientId, projectId, payload.id]
      );
      if (result.affectedRows === 0) {
          throw new ProjectNotFoundError();
      }
    }

  async getProjectById(projectId,route=false, userId=null) {
      let rows;
      if (route) {
        [rows] = await pool.query(
          'SELECT * FROM projects WHERE id = ? AND user_id = ?',
          [projectId, userId]
        );
        if (rows.length === 0) throw new ProjectNotFoundError();
      } else {
        [rows] = await pool.query(
          'SELECT * FROM projects WHERE id = ?',
        [projectId]
        );
        if (rows.length === 0) throw new ProjectNotFoundError();
      }

      const raw = rows[0];

      const projectData = new Project({
          id: raw.id,
          name: raw.name,
          email: raw.email,
          address: JSON.parse(raw.address),
          userId: raw.user_id,
          clientId: raw.client_id,
          archived: raw.archived
  });

  return projectData;
  }

  async getProjects(userId) {
      const [rows] = await pool.query(
          'SELECT * FROM projects WHERE user_id = ?',
          [userId]
      );

      const projects = rows.map(raw => new Project({
          id: raw.id,
          name: raw.name,
          email: raw.email,
          address: JSON.parse(raw.address),
          userId: raw.user_id,
          clientId: raw.client_id,
          archived: raw.archived
      }));
  
      return projects.map(project => project.publicData);
  }

  async deleteProject(projectId, soft, payload) {
        const [[authorized]]= await pool.query(
          'SELECT * FROM projects WHERE id = ?',
          [projectId, payload.id]
        );
        if (!authorized) throw new ProjectNotFoundError();
        if (authorized.user_id !== payload.id) throw new NotAuthorizedError();
        if (authorized.archived === 1) throw new ProjectArchivedError();
      if (soft) {
          await pool.query(
            "UPDATE projects SET archived = 1 WHERE id = ?",
            [projectId]
          );
        } else {
          await pool.query(
            "DELETE FROM projects WHERE id = ?",
            [projectId]
          );
        }
  }

  async getArchived(userId) {
      const [rows] = await pool.query(
          'SELECT * FROM projects WHERE user_id = ? AND archived = 1', 
          [userId]
      );
  
      const projects = rows.map(raw => new Project({
          id: raw.id,
          name: raw.name,
          email: raw.email,
          address: JSON.parse(raw.address),
          userId: raw.user_id,
          clientId: raw.client_id,
          archived: raw.archived
      }));
  
      return projects.map(project => project.publicData);
  }

  async restoreArchived(projectId, userId) {
      const [rows] = await pool.query(
            'SELECT user_id, archived FROM projects WHERE id = ? ',
            [projectId]
        );
        if (rows.length === 0) {
            throw new ProjectNotFoundError();
        }

        const project = rows[0];

        if (project.user_id !== userId) {
            throw new NotAuthorizedError();
        }

        if (project.archived === 0) {
            throw new ProjectNotArchivedError();
        }
        await pool.query(
            "UPDATE projects SET archived = 0 WHERE id = ? ",
            [projectId]
        );
  }

}

module.exports = new projectDAO();