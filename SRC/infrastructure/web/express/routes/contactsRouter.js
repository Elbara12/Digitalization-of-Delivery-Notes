/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

const express = require('express');
const { authenticator } = require("../middlewares/authenticator");
const { UserController } = require("../../controller/userController");
const contactDAO  = require("../../../persistence/mysql/contactDAO");
const { handleController } = require("../../common/handleController");
const multer = require("multer");
const upload = require("../middlewares/image");
const logger = require("../../utils/logger");

async function configureUserRouter() {
    const router = express.Router();
    const userController = new UserController(contactDAO);

    /**
     * @swagger
     * /api/user/register:
     *   post:
     *     summary: Register a new user
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       201:
     *         description: User registered successfully
     */
    router.post('/register', handleController(userController.registration.bind(userController)));

    /**
     * @swagger
     * /api/user/validation:
     *   put:
     *     summary: Validate user email
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Email validated
     */
    router.put('/validation', authenticator , handleController(userController.validation.bind(userController)));

    /**
     * @swagger
     * /api/user/login:
     *   post:
     *     summary: Login a user
     *     tags: [User]
     *     responses:
     *       200:
     *         description: User logged in
     */
    router.post('/login', handleController(userController.login.bind(userController)));

    /**
     * @swagger
     * /api/user/company:
     *   put:
     *     summary: Complete company onboarding
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Company onboarded
     */
    router.put("/company", authenticator, handleController(userController.onBoardingCompany.bind(userController)));

    /**
     * @swagger
     * /api/user/company:
     *   patch:
     *     summary: Complete company onboarding (partial)
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Company onboarded
     */
    router.patch("/company", authenticator, handleController(userController.onBoardingCompany.bind(userController)));

    /**
     * @swagger
     * /api/user/register:
     *   put:
     *     summary: Complete personal user onboarding
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Personal user onboarded
     */
    router.put("/register", authenticator, handleController(userController.onBoardingUser.bind(userController)));

    /**
     * @swagger
     * /api/user/register:
     *   patch:
     *     summary: Complete personal user onboarding (partial)
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: Personal user onboarded
     */
    router.patch("/register", authenticator, handleController(userController.onBoardingUser.bind(userController)));

    /**
     * @swagger
     * /api/user/logo:
     *   patch:
     *     summary: Upload user logo
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Logo uploaded
     */
    router.patch("/logo", authenticator, (req, res, next) => {
        upload.single("image")(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                logger.error("Multer error: ", {error: err, message: err.message});
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Errore interno durante l'upload" });
            }
            next();
        });
    }, handleController(userController.urlUpload.bind(userController)));

    /**
     * @swagger
     * /api/user/data:
     *   get:
     *     summary: Get user data
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: User data retrieved
     */
    router.get("/data", authenticator, handleController(userController.getUser.bind(userController)));

    /**
     * @swagger
     * /api/user/delete:
     *   delete:
     *     summary: Delete user account
     *     tags: [User]
     *     security: [bearerAuth: []]
     *     responses:
     *       200:
     *         description: User deleted
     */
    router.delete("/delete", authenticator, handleController(userController.delete.bind(userController)));

    /**
     * @swagger
     * /api/user/recovery:
     *   post:
     *     summary: Start password recovery
     *     tags: [User]
     *     responses:
     *       200:
     *         description: Recovery email sent
     */
    router.post("/recovery", handleController(userController.recovery.bind(userController)));

    /**
     * @swagger
     * /api/user/recovery/newpassword:
     *   post:
     *     summary: Set new password
     *     tags: [User]
     *     responses:
     *       200:
     *         description: Password updated
     */
    router.post("/recovery/newpassword", handleController(userController.newPassword.bind(userController)));

    /**
     * @swagger
     * /api/user/summarize:
     *   get:
     *     summary: Get summarized user stats
     *     tags: [User]
     *     responses:
     *       200:
     *         description: Summary retrieved
     */
    router.get("/summarize", handleController(userController.summarize.bind(userController)));

    return router;
}

module.exports = configureUserRouter;