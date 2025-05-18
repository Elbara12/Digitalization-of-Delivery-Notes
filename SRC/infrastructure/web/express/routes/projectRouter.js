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
     *     tags:
     *       - Project
     *     summary: Create a new project
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "myProject"
     *               email:
     *                 type: string
     *                 example: "email@gmail.com"
     *               address:
     *                 type: string
     *                 example: "myAddress"
     *               clientId:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       "200":
     *         description: Returns the created object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: "myProject"
     *                 email:
     *                   type: string
     *                   example: "email@gmail.com"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 userId:
     *                   type: integer
     *                   example: 1
     *                 clientId:
     *                   type: integer
     *                   example: 1
     *                 archived:
     *                   type: boolean
     *                   example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "400":
     *         $ref: '#/components/responses/ProjectAlreadyExistsError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post('/', authenticator, handleController(projectController.registration.bind(projectController)));

    /**
     * @swagger
     * /api/project:
     *   get:
     *     tags:
     *       - Project
     *     summary: Get all projects from a user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Returns all projects
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   name:
     *                     type: string
     *                     example: "myProject"
     *                   email:
     *                     type: string
     *                     example: "email@gmail.com"
     *                   address:
     *                     type: string
     *                     example: "myAddress"
     *                   archived:
     *                     type: boolean
     *                     example: false
     *                   user_id:
     *                     type: integer
     *                     example: 1
     *                   client_id:
     *                     type: integer
     *                     example: 1
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/', authenticator, handleController(projectController.getProjects.bind(projectController)));

    /**
     * @swagger
     * /api/project/archived:
     *   get:
     *     summary: Get archived project
     *     tags:
     *       - Project
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Returns all projects archived from a user
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   name:
     *                     type: string
     *                     example: "myClient"
     *                   CIF:
     *                     type: string
     *                     example: "A12345678"
     *                   address:
     *                     type: string
     *                     example: "myAddress"
     *                   user_id:
     *                     type: integer
     *                     example: 1
     *                   client_id:
     *                     type: integer
     *                     example: 1
     *                   archived:
     *                     type: boolean
     *                     example: true
     *                   message:
     *                     type: string
     *                     example: "Archived projects retrieved successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/archived', authenticator, handleController(projectController.getArchived.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   put:
     *     tags:
     *       - Project
     *     summary: Update a project
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: projectId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "myProject"
     *               email:
     *                 type: string
     *                 example: "email@gmail.com"
     *               address:
     *                 type: string
     *                 example: "myAddress"
     *               client_id:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       "200":
     *         description: Returns the updated object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: "myProject"
     *                 email:
     *                   type: string
     *                   example: "email@gmail.com"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 archived:
     *                   type: boolean
     *                   example: false
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 client_id:
     *                   type: integer
     *                   example: 1
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.put('/:projectId', authenticator, handleController(projectController.update.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   patch:
     *     tags:
     *       - Project
     *     summary: Update a project
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: projectId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "myProject"
     *               email:
     *                 type: string
     *                 example: "email@gmail.com"
     *               address:
     *                 type: string
     *                 example: "myAddress"
     *               client_id:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       "200":
     *         description: Returns the updated object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: "myProject"
     *                 email:
     *                   type: string
     *                   example: "email@gmail.com"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 archived:
     *                   type: boolean
     *                   example: false
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 client_id:
     *                   type: integer
     *                   example: 1
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.patch('/:projectId', authenticator, handleController(projectController.update.bind(projectController)));

    /**
     * @swagger
     * /api/project/{projectId}:
     *   get:
     *     tags:
     *       - Project
     *     summary: Get a project by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: projectId
     *         in: query
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project
     *     responses:
     *       "200":
     *         description: Returns the project object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: "myProject"
     *                 email:
     *                   type: string
     *                   example: "email@gmail.com"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 archived:
     *                   type: boolean
     *                   example: false
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 client_id:
     *                   type: integer
     *                   example: 1
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ProjectNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/:projectId', authenticator, handleController(projectController.getProjectById.bind(projectController)));

    /**
     * @swagger
     * /api/project/delete/{projectId}:
     *   delete:
     *     tags:
     *       - Project
     *     summary: Delete a project (soft or hard)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: projectId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project to delete
     *       - name: soft
     *         in: query
     *         required: true
     *         schema:
     *           type: boolean
     *         description: Perform a soft delete if true; otherwise, hard delete.
     *     responses:
     *       "200":
     *         description: Deletes the project
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Project deleted"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ProjectNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.delete('/delete/:projectId', authenticator, handleController(projectController.delete.bind(projectController)));

    /**
     * @swagger
     * /api/project/archived/restore/{projectId}:
     *   get:
     *     tags:
     *       - Project
     *     summary: Restore a soft-deleted project
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: projectId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project to restore
     *     responses:
     *       "200":
     *         description: Restores the project
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Project restored successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ProjectNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/archived/restore/:projectId', authenticator, handleController(projectController.restoreArchived.bind(projectController)));

    return router;
}

module.exports = configureProjectRouter;