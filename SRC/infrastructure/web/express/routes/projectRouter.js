/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management endpoints
 */

const express = require('express');
const { authenticator } = require("../middlewares/authenticator");
const { ProjectController } = require("../../controller/projectController");
const projectDAO  = require("../../../persistence/mysql/projectDAO");
const { handleController } = require("../../common/handleController");

async function configureProjectRouter() {
    const router = express.Router();
    const projectController = new ProjectController(projectDAO);

    /**
     * @swagger
     * /api/project:
     *   post:
     *     summary: Create a new project
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               address:
     *                 type: object
     *               clientId:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Project created
     */
    router.post('/', authenticator, handleController(projectController.registration.bind(projectController)));

    /**
     * @swagger
     * /api/project:
     *   get:
     *     summary: List all projects
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: List of projects
     */
    router.get('/', authenticator, handleController(projectController.getProjects.bind(projectController)));

    /**
     * @swagger
     * /api/project/archived:
     *   get:
     *     summary: List archived projects
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Archived projects list
     */
    router.get('/archived', authenticator, handleController(projectController.getArchived.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   put:
     *     summary: Update a project
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Project updated
     */
    router.put('/:projectId', authenticator, handleController(projectController.update.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   patch:
     *     summary: Partially update a project
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Project partially updated
     */
    router.patch('/:projectId', authenticator, handleController(projectController.update.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   get:
     *     summary: Get a project by ID
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Project data
     */
    router.get('/:projectId', authenticator, handleController(projectController.getProjectById.bind(projectController)));

    /**
     * @swagger
     * /api/project/delete/{projectId}:
     *   delete:
     *     summary: Delete a project
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Project deleted
     */
    router.delete('/delete/:projectId', authenticator, handleController(projectController.delete.bind(projectController)));

    /**
     * @swagger
     * /api/project/archived/restore/{projectId}:
     *   get:
     *     summary: Restore an archived project
     *     tags: [Project]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Project restored
     */
    router.get('/archived/restore/:projectId', authenticator, handleController(projectController.restoreArchived.bind(projectController)));

    return router;
}

module.exports = configureProjectRouter;