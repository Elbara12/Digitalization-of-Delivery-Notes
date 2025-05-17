/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client management endpoints
 */

const express = require('express');
const { authenticator } = require("../middlewares/authenticator");
const { ClientController } = require("../../controller/clientController");
const clientDAO  = require("../../../persistence/mysql/clientDAO");
const { handleController } = require("../../common/handleController");

async function configureClientRouter() {
    const router = express.Router();

    const clientController = new ClientController(clientDAO);

    /**
     * @swagger
     * /api/client:
     *   post:
     *     summary: Create a new client
     *     tags: [Client]
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
     *               cif:
     *                 type: string
     *               address:
     *                 type: object
     *     responses:
     *       201:
     *         description: Client created successfully
     */
    router.post('/', authenticator, handleController(clientController.registration.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   put:
     *     summary: Update a client
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Client updated
     */
    router.put('/', authenticator, handleController(clientController.update.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   patch:
     *     summary: Partially update a client
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Client updated partially
     */
    router.patch('/', authenticator, handleController(clientController.update.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   get:
     *     summary: Get all clients
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of clients
     */
    router.get('/', authenticator, handleController(clientController.getClient.bind(clientController)));

     /**
     * @swagger
     * /api/client/archived:
     *   get:
     *     summary: Get archived clients
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of archived clients
     */
    router.get('/archived', authenticator, handleController(clientController.getArchived.bind(clientController)));

    /**
     * @swagger
     * /api/client/{clientId}:
     *   get:
     *     summary: Get client by ID
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the client
     *     responses:
     *       200:
     *         description: Client data
     */
    router.get('/:clientId', authenticator, handleController(clientController.getClientById.bind(clientController)));

    /**
     * @swagger
     * /api/client/delete/{clientId}:
     *   delete:
     *     summary: Delete a client
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the client to delete
     *     responses:
     *       200:
     *         description: Client deleted
     */
    router.delete('/delete/:clientId', authenticator, handleController(clientController.delete.bind(clientController)));

    /**
     * @swagger
     * /api/client/archived/restore/{clientId}:
     *   get:
     *     summary: Restore an archived client
     *     tags: [Client]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: clientId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the client to restore
     *     responses:
     *       200:
     *         description: Client restored
     */
    router.get('/archived/restore/:clientId', authenticator, handleController(clientController.restoreArchived.bind(clientController)));

    return router;
}

module.exports = configureClientRouter;
