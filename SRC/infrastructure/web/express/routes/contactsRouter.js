/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management endpoints
 *   - name: Company
 *     description: Company management endpoints
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
     *  post:
     *     tags:
     *       - User
     *     summary: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: matteo@gmail.com
     *               password:
     *                 type: string
     *                 example: 12345678
     *     responses:
     *       "200":
     *         description: Returns the created object and a JWT token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: tobevalidated
     *                 role:
     *                   type: string
     *                   example: user
     *       "400":
     *         $ref: '#/components/responses/InvalidEmailSendingError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post('/register', handleController(userController.registration.bind(userController)));

    /**
     * @swagger
     * /api/user/validation:
     *   put:
     *     tags:
     *       - User
     *     summary: Validate a user
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email_code:
     *                 type: string
     *                 example: 123456
     *     responses:
     *       "200":
     *         description: Validates the user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: active
     *                 role:
     *                   type: string
     *                   example: user
     *       "400":
     *         $ref: '#/components/responses/EmailAlreadyValidatedError'
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.put('/validation', authenticator , handleController(userController.validation.bind(userController)));

    /**
     * @swagger
     * /api/user/login:
     *   post:
     *     tags:
     *       - User
     *     summary: Login a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: "matteo@gmail.com"
     *               password:
     *                 type: string
     *                 example: "12345678"
     *     responses:
     *       "200":
     *         description: Returns the created object and a JWT token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: "active"
     *                 role:
     *                   type: string
     *                   example: "user"
     *       "400":
     *         $ref: '#/components/responses/InvalidPasswordMatchError'
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/EmailNotRegisteredError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post('/login', handleController(userController.login.bind(userController)));

    /**
     * @swagger
     * /api/user/company:
     *   put:
     *     tags:
     *       - Company
     *     summary: Create a new company
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
     *                 example: "myCompany"
     *               address:
     *                 type: string
     *                 example: "myAddress"
     *               CIF:
     *                 type: string
     *                 example: "A12345678"
     *     responses:
     *       "200":
     *         description: Data from company is added
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: "active"
     *                 role:
     *                   type: string
     *                   example: "company"
     *                 name:
     *                   type: string
     *                   example: "myCompany"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "403":
     *         $ref: '#/components/responses/InvalidRouteUserError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.put("/company", authenticator, handleController(userController.onBoardingCompany.bind(userController)));

    /**
     * @swagger
     * /api/user/company:
     *   patch:
     *     tags:
     *       - Company
     *     summary: Create a new company
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
     *                 example: "myCompany"
     *               address:
     *                 type: string
     *                 example: "myAddress"
     *               CIF:
     *                 type: string
     *                 example: "A12345678"
     *     responses:
     *       "200":
     *         description: Data from company is added
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: "active"
     *                 role:
     *                   type: string
     *                   example: "company"
     *                 name:
     *                   type: string
     *                   example: "myCompany"
     *                 address:
     *                   type: string
     *                   example: "myAddress"
     *                 CIF:
     *                   type: string
     *                   example: "A12345678"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "403":
     *         $ref: '#/components/responses/InvalidRouteUserError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.patch("/company", authenticator, handleController(userController.onBoardingCompany.bind(userController)));

    /**
     * @swagger
     * /api/user/register:
     *   put:
     *     tags:
     *       - User
     *     summary: Onboard a user
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
     *                 example: "Matteo"
     *               surname:
     *                 type: string
     *                 example: "Rossi"
     *               NIF:
     *                 type: string
     *                 example: "12345678A"
     *     responses:
     *       "200":
     *         description: Add data to the user and make it a 'personal' user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: "active"
     *                 role:
     *                   type: string
     *                   example: "personal_user"
     *                 name:
     *                   type: string
     *                   example: "Matteo"
     *                 surname:
     *                   type: string
     *                   example: "Rossi"
     *                 NIF:
     *                   type: string
     *                   example: "12345678A"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "403":
     *         $ref: '#/components/responses/InvalidRouteCompanyError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */

    router.put("/register", authenticator, handleController(userController.onBoardingUser.bind(userController)));

    /**
     * @swagger
     * /api/user/register:
     *   patch:
     *     tags:
     *       - User
     *     summary: Onboard a user
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
     *                 example: "Matteo"
     *               surname:
     *                 type: string
     *                 example: "Rossi"
     *               NIF:
     *                 type: string
     *                 example: "12345678A"
     *     responses:
     *       "200":
     *         description: Add data to the user and make it a 'personal' user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     *                 email:
     *                   type: string
     *                   example: matteo@gmail.com
     *                 status:
     *                   type: string
     *                   example: "active"
     *                 role:
     *                   type: string
     *                   example: "personal_user"
     *                 name:
     *                   type: string
     *                   example: "Matteo"
     *                 surname:
     *                   type: string
     *                   example: "Rossi"
     *                 NIF:
     *                   type: string
     *                   example: "12345678A"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "403":
     *         $ref: '#/components/responses/InvalidRouteCompanyError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.patch("/register", authenticator, handleController(userController.onBoardingUser.bind(userController)));

    /**
     * @swagger
     * /api/user/logo:
     *   patch:
     *     tags:
     *       - User
     *     summary: Upload a profile picture for a user
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       "200":
     *         description: Uploads a profile picture for a user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "File uploaded successfully"
     *                 url:
     *                   type: string
     *                   example: "https://example.com/path/to/image.jpg"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
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
     *     tags:
     *       - User
     *     summary: Get the current user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       "200":
     *         description: Returns the current user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 email:
     *                   type: string
     *                   example: "matteo@gmail.com"
     *                 emailstatus:
     *                   type: integer
     *                   example: 1
     *                 attempts:
     *                   type: integer
     *                   example: 5
     *                 status:
     *                   type: string
     *                   example: "validated"
     *                 role:
     *                   type: string
     *                   example: "personal"
     *                 url:
     *                   type: string
     *                   example: "https://example.com/profile.png"
     *                 name:
     *                   type: string
     *                   example: "Matteo"
     *                 surname:
     *                   type: string
     *                   example: "Rossi"
     *                 NIF:
     *                   type: string
     *                   example: "12345678A"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get("/data", authenticator, handleController(userController.getUser.bind(userController)));

    /**
     * @swagger
     * /api/user/delete:
     *   delete:
     *     tags:
     *       - User
     *     summary: Soft delete a user
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: soft
     *         in: query
     *         required: true
     *         schema:
     *           type: boolean
     *         description: Perform a soft delete if true; otherwise, perform a hard delete.
     *     responses:
     *       "200":
     *         description: Soft delete a user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                  type: string
     *                  example: "User deleted successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.delete("/delete", authenticator, handleController(userController.delete.bind(userController)));

    /**
     * @swagger
     * /api/user/recovery:
     *   post:
     *     tags:
     *       - User
     *     summary: Request a password reset
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: "matteo@gmail.com"
     *     responses:
     *       "200":
     *         description: Sends a mail with a reset token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Password reset email sent successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post("/recovery", handleController(userController.recovery.bind(userController)));

    /**
     * @swagger
     * /api/user/recovery/newpassword:
     *   post:
     *     tags:
     *       - User
     *     summary: Reset the password
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               recoveryCode:
     *                 type: string
     *                 example: "123456"
     *               password:
     *                 type: string
     *                 example: "12345678"
     *     responses:
     *       "200":
     *         description: Password is resetted
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Password changed successfully"
     *       "401":
     *         $ref: '#/components/responses/InvalidJWTError'
     *       "404":
     *         $ref: '#/components/responses/UserNotFoundError'
     *       "400":
     *         $ref: '#/components/responses/InvalidPasswordError'
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.post("/recovery/newpassword", handleController(userController.newPassword.bind(userController)));

    /**
     * @swagger
     * /api/user/summarize:
     *   get:
     *     tags:
     *       - User
     *     summary: Get the dashboard data
     *     responses:
     *       "200":
     *         description: Returns the dashboard data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 numActiveUsers:
     *                   type: integer
     *                   example: 10
     *                 numDeletedUsers_soft:
     *                   type: integer
     *                   example: 2
     *                 numInactiveUsers:
     *                   type: integer
     *                   example: 5
     *                 numActiveCompanyUsers:
     *                   type: integer
     *                   example: 8
     *                 numActivePersonalUsers:
     *                   type: integer
     *                   example: 7
     *                 numDeactivatedUsers:
     *                   type: integer
     *                   example: 3
     *       "500":
     *         $ref: '#/components/responses/InvalidDatabaseError'
     */
    router.get("/summarize", handleController(userController.summarize.bind(userController)));

    return router;
}

module.exports = configureUserRouter;