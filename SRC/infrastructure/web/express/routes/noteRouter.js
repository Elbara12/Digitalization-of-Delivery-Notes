/**
 * @swagger
 * tags:
 *   name: DeliveryNote
 *   description: Delivery note management endpoints
 */

const express = require('express');
const { authenticator } = require("../middlewares/authenticator");
const { NoteController } = require("../../controller/noteCotroller");
const noteDAO  = require("../../../persistence/mysql/noteDAO");
const { handleController } = require("../../common/handleController");
const multer = require("multer");
const upload = require("../middlewares/image");
const logger = require("../../utils/logger");

async function configureNoteRouter() {
    const router = express.Router();

    const noteController = new NoteController(noteDAO);

    /**
     * @swagger
     * /api/deliverynote:
     *   post:
     *     summary: Create a new delivery note
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     responses:
     *       201:
     *         description: Note created successfully
     */
    router.post('/', authenticator, handleController(noteController.create.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote:
     *   get:
     *     summary: Get all delivery notes for the logged-in user
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: List of delivery notes
     */
    router.get('/',authenticator, handleController(noteController.getAll.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote/{noteId}:
     *   get:
     *     summary: Get a specific delivery note by ID
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: noteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the delivery note
     *     responses:
     *       200:
     *         description: Delivery note data
     */
    router.get('/:noteId',authenticator, handleController(noteController.getNoteById.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote/pdf/{noteId}:
     *   get:
     *     summary: Generate and download a delivery note PDF
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: noteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the delivery note
     *     responses:
     *       200:
     *         description: PDF URL
     */
    router.get('/pdf/:noteId',authenticator, handleController(noteController.downloadPdf.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote/sign/{noteId}:
     *   patch:
     *     summary: Sign a delivery note (upload signature)
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: noteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the delivery note
     *     responses:
     *       200:
     *         description: Signature uploaded
     */
    router.patch("/sign/:noteId",authenticator,(req, res, next) => {
        upload.single("image")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          logger.error("Multer error: ", {error: err, message: err.message});
          return res.status(400).json({ error: err.message });
        } else if (err) {
          return res.status(500).json({ error: "Internal error during upload" });
        }
        next();
      });
    }, handleController(noteController.urlUpload.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote/delete/{noteId}:
     *   delete:
     *     summary: Delete a delivery note (if not signed)
     *     tags: [DeliveryNote]
     *     security: [bearerAuth: []]
     *     parameters:
     *       - in: path
     *         name: noteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the delivery note
     *     responses:
     *       200:
     *         description: Delivery note deleted
     */
    router.delete('/delete/:noteId',authenticator, handleController(noteController.delete.bind(noteController)));

    return router;
}

module.exports = configureNoteRouter;
