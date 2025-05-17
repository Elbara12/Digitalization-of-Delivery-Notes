const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const logger = require("../utils/logger");
const OAuth2 = google.auth.OAuth2;
const { InvalidEmailSendingError, } = require("../../../business/error");

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token.");
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken,
        },
    });

    transporter.on("token", token => {
        if (token?.accessToken) {
          logger.info("🔑 Nuovo accessToken ricevuto", {
            accessToken: token.accessToken,
            expires: new Date(token.expires),
          });
        }
    });

    return transporter;
};

const sendEmail = async (emailOptions) => {
    try {
        logger.info(`Try to send email: ${emailOptions.to}`);
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
        logger.info(`Email sent successfully ${emailOptions.to}`);
    } catch (e) {
        logger.info(`Error sending email: ${e.message}`, "ERROR");
        throw new InvalidEmailSendingError();
    }
  };

  module.exports = { sendEmail };


// se non parte l'email non lo registro, visto che l'eamil parte per ultima cancello tutto il dato