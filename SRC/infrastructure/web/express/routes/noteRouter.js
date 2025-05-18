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
     * /api/deliveryNote:
     *   post:
     *     tags:
     *       - DeliveryNote
     *     summary: Create a new delivery note
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               clientId:
     *                 type: string
     *                 example: "23"
     *               projectId:
     *                 type: string
     *                 example: "3"
     *               entries:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     person:
     *                       type: string
     *                       example: "person"
     *                     type:
     *                       type: string
     *                       example: "material/hours"
     *                     material:
     *                       type: string
     *                       example: "material"
     *                     hours:
     *                       type: integer
     *                       example: 10
     *                     quantity:
     *                       type: integer
     *                       example: 5
     *                     description:
     *                       type: string
     *                       example: "description"
     *                     workdate:
     *                       type: string
     *                       example: "2023-10-01"
     *     responses:
     *       "200":
     *         description: Returns the created delivery note
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 userId:
     *                   type: integer
     *                   example: 1
     *                 clientId:
     *                   type: string
     *                   example: "23"
     *                 projectId:
     *                   type: string
     *                   example: "3"
     *                 signed:
     *                   type: boolean
     *                   example: false
     *                 signatureUrl:
     *                   type: string
     *                   example: "https://example.com/signature.png"
     *                 pdfUrl:
     *                   type: string
     *                   example: "https://example.com/deliverynote.pdf"
     *                 entries:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                         example: 1
     *                       deliveryNoteId:
     *                         type: integer
     *                         example: 1
     *                       person:
     *                         type: string
     *                         example: "person"
     *                       type:
     *                         type: string
     *                         example: "material/hours"
     *                       material:
     *                         type: string
     *                         example: "material"
     *                       hours:
     *                         type: string
     *                         example: "5"
     *                       quantity:
     *                         type: string
     *                         example: "5"
     *                       description:
     *                         type: string
     *                         example: "description"
     *                       workdate:
     *                         type: string
     *                         example: "2023-10-01"
     *       "400":
     *         $ref: '#/components/responses/InvalidNoteFormatError'
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/NoteNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post('/', authenticator, handleController(noteController.create.bind(noteController)));

    /**
     * @swagger
     * /api/deliveryNote:
     *   get:
     *     tags:
     *       - DeliveryNote
     *     summary: Get all delivery notes from a user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: List of delivery notes
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
     *                   userId:
     *                     type: integer
     *                     example: 1
     *                   clientId:
     *                     type: string
     *                     example: "23"
     *                   projectId:
     *                     type: string
     *                     example: "3"
     *                   signed:
     *                     type: boolean
     *                     example: false
     *                   signatureUrl:
     *                     type: string
     *                     example: "https://example.com/signature.png"
     *                   pdfUrl:
     *                     type: string
     *                     example: "https://example.com/deliverynote.pdf"
     *                   entries:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: integer
     *                           example: 1
     *                         deliveryNoteId:
     *                           type: integer
     *                           example: 1
     *                         person:
     *                           type: string
     *                           example: "person"
     *                         type:
     *                           type: string
     *                           example: "material/hours"
     *                         material:
     *                           type: string
     *                           example: "material"
     *                         hours:
     *                           type: string
     *                           example: "5"
     *                         quantity:
     *                           type: string
     *                           example: "5"
     *                         description:
     *                           type: string
     *                           example: "description"
     *                         workdate:
     *                           type: string
     *                           example: "2023-10-01"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/',authenticator, handleController(noteController.getAll.bind(noteController)));

    /**
     * @swagger
     * /api/deliverynote/{noteId}:
     *   get:
     *     tags:
     *       - DeliveryNote
     *     summary: Get a delivery note by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: noteId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Returns a single delivery note
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 userId:
     *                   type: integer
     *                   example: 1
     *                 clientId:
     *                   type: string
     *                   example: "23"
     *                 projectId:
     *                   type: string
     *                   example: "3"
     *                 signed:
     *                   type: boolean
     *                   example: false
     *                 signatureUrl:
     *                   type: string
     *                   example: "https://example.com/signature.png"
     *                 pdfUrl:
     *                   type: string
     *                   example: "https://example.com/deliverynote.pdf"
     *                 entries:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                         example: 1
     *                       deliveryNoteId:
     *                         type: integer
     *                         example: 1
     *                       person:
     *                         type: string
     *                         example: "person"
     *                       type:
     *                         type: string
     *                         example: "material/hours"
     *                       material:
     *                         type: string
     *                         example: "material"
     *                       hours:
     *                         type: string
     *                         example: "5"
     *                       quantity:
     *                         type: string
     *                         example: "5"
     *                       description:
     *                         type: string
     *                         example: "description"
     *                       workdate:
     *                         type: string
     *                         example: "2023-10-01"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/NoteNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/:noteId',authenticator, handleController(noteController.getNoteById.bind(noteController)));

    /**
     * @swagger
     * /api/deliveryNote/pdf/{noteId}:
     *   get:
     *     tags:
     *       - DeliveryNote
     *     summary: Generate a PDF for a delivery note
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: noteId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: PDF generated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 url:
     *                   type: string
     *                   example: "https://example.com/deliverynote.pdf"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/NoteNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get('/pdf/:noteId',authenticator, handleController(noteController.downloadPdf.bind(noteController)));

    /**
     * @swagger
     * /api/deliveryNote/sign/{noteId}:
     *   patch:
     *     tags:
     *       - DeliveryNote
     *     summary: Sign a delivery note
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: noteId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Delivery note signed
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Delivery note signed"
     *                 Url:
     *                   type: string
     *                   example: "https://example.com/signature.png"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/NoteNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
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
     * /api/deliveryNote/delete/{noteId}:
     *   delete:
     *     tags:
     *       - DeliveryNote
     *     summary: Delete a delivery note (soft or hard)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: noteid
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *       - name: soft
     *         in: query
     *         required: true
     *         schema:
     *           type: boolean
     *     responses:
     *       "200":
     *         description: Delivery note deleted
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Note 2 deleted successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/NoteNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.delete('/delete/:noteId',authenticator, handleController(noteController.delete.bind(noteController)));

    return router;
}

module.exports = configureNoteRouter;
