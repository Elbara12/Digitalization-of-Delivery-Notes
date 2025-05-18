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
     *     tags:
     *       - Client
     *     summary: Create a new client
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
     *                 example: "myClient"
     *               CIF:
     *                 type: string
     *                 example: "A12345678"
     *               address:
     *                 type: string
     *                 example: "myAddress"
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
     *                   example: "myClient"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 archived:
     *                   type: boolean
     *                   example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "400":
     *         $ref: '#/components/responses/CifAlreadyInUseError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post('/', authenticator, handleController(clientController.registration.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   put:
     *     tags:
     *       - Client
     *     summary: Update a client
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               client_id:
     *                 type: integer
     *                 example: 1
     *               name:
     *                 type: string
     *                 example: "myClient"
     *               CIF:
     *                 type: string
     *                 example: "A12345678"
     *               address:
     *                 type: string
     *                 example: "myAddress"
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
     *                   example: "myClient"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 archived:
     *                   type: boolean
     *                   example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ClientNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */

    router.put('/', authenticator, handleController(clientController.update.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   patch:
     *     tags:
     *       - Client
     *     summary: Update a client
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               client_id:
     *                 type: integer
     *                 example: 1
     *               name:
     *                 type: string
     *                 example: "myClient"
     *               CIF:
     *                 type: string
     *                 example: "A12345678"
     *               address:
     *                 type: string
     *                 example: "myAddress"
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
     *                   example: "myClient"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 archived:
     *                   type: boolean
     *                   example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ClientNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.patch('/', authenticator, handleController(clientController.update.bind(clientController)));

    /**
     * @swagger
     * /api/client:
     *   get:
     *     tags:
     *       - Client
     *     summary: Get all clients from a user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Returns all clients from a user
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
     *                   archived:
     *                     type: boolean
     *                     example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */

    router.get('/', authenticator, handleController(clientController.getClient.bind(clientController)));

     /**
     * @swagger
     * /api/client/archived:
     *   get:
     *     summary: Get archived clients
     *     tags:
     *       - Client
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Returns all clients archived from a user
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
     *                   archived:
     *                     type: boolean
     *                     example: true
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/archived', authenticator, handleController(clientController.getArchived.bind(clientController)));

    /**
     * @swagger
     * /api/client/{clientId}:
     *   get:
     *     tags:
     *       - Client
     *     summary: Get a client by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: clientId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the client to retrieve
     *     responses:
     *       "200":
     *         description: Returns the client object
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
     *                   example: "myClient"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 user_id:
     *                   type: integer
     *                   example: 1
     *                 archived:
     *                   type: boolean
     *                   example: false
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ClientNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */

    router.get('/:clientId', authenticator, handleController(clientController.getClientById.bind(clientController)));

    /**
     * @swagger
     * /api/client/delete/{clientId}:
     *   delete:
     *     tags:
     *       - Client
     *     summary: Delete a client (soft or hard)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: clientId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the client to delete
     *       - name: soft
     *         in: query
     *         required: true
     *         schema:
     *           type: boolean
     *         description: Perform a soft delete if true; otherwise, perform a hard delete.
     *     responses:
     *       "200":
     *         description: Soft delete a client
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 Message:
     *                   type: string
     *                   example: "Client deleted"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ClientNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.delete('/delete/:clientId', authenticator, handleController(clientController.delete.bind(clientController)));

    /**
     * @swagger
     * /api/client/archived/restore/{clientId}:
     *   get:
     *     tags:
     *       - Client
     *     summary: Restore a soft-deleted client
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: clientId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the client to restore
     *     responses:
     *       "200":
     *         description: Restores a soft-deleted client
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 Message:
     *                   type: string
     *                   example: "Client restored successfully"
     *       "400":
     *         $ref: '#/components/responses/ClientNotArchivedError'
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/ClientNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/archived/restore/:clientId', authenticator, handleController(clientController.restoreArchived.bind(clientController)));

    return router;
}

module.exports = configureClientRouter;
