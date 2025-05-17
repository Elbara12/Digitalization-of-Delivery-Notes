const pool = require('./db');
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../web/services/emailService");
const { Contact }= require("../../../business/contact/domain/contact");
const {
  InvalidDatabaseError,
  UserDeactivatedError,
  InvalidJWTError,
  InvalidEmailSendingError,
  InvalidEmailCodeError,
  UserNotFoundError,
  EmailNotRegisteredError,
  InvalidEmailValidationError,
  InvalidPasswordMatchError,
}= require("../../../business/error")
const logger = require("../../web/utils/logger")

class ContactDAO { 
  constructor() {
    this.init();
  }

  async init() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          surname VARCHAR(100),
          CIF VARCHAR(50),
          NIF VARCHAR(50),
          address VARCHAR(255),
          email VARCHAR(150) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          attempts INT NOT NULL,
          email_code VARCHAR(100) NOT NULL,
          emailstatus VARCHAR(50) NOT NULL,
          role VARCHAR(50) NOT NULL,
          url VARCHAR(255),
          status VARCHAR(50) DEFAULT 'active',
          codeRecovery VARCHAR(50)
        )
      `);
      logger.info("Table 'users' created or already exists");
    } catch (err) {
      logger.error("Error creating table 'users':", err);
      throw new InvalidDatabaseError();
    }
  }

  async insert(contact) {
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, attempts, email_code, emailstatus, role, status, name, surname, NIF, CIF, address, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        contact.email,
        contact.password_hash,
        contact.attempts,
        contact.email_code,
        contact.emailstatus,
        contact.role,
        contact.status,
        contact.name,
        contact.surname,
        contact.NIF,
        contact.CIF,
        contact.address,
        contact.url,
      ]
    );

    contact.id = result.insertId;
    return contact;
  }

  async checkEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0;
  }

  async validateMail(payload, email_code) {
    const [statusRow] = await pool.query(
      "SELECT status FROM users WHERE id = ?",
      [payload.id]
    );

    if (!statusRow || statusRow.status === "deactivated") {
      logger.error("User deactivated");
      throw new UserDeactivatedError();
    }
    const [rows] = await pool.query( 
      "SELECT email_code FROM users WHERE id = ?",
      [payload.id]
    );
    if (rows.length === 0) {
      logger.error("User not found, JWT invalid");
      throw new InvalidJWTError();
    }
    const email_code_db = rows[0].email_code;
    if (email_code_db == email_code) {
      await pool.query(
        "UPDATE users SET emailstatus = 1, status = 'active' WHERE id = ?",
        [payload.id]
      );
      return;
    }
    const [attempts_obj] = await pool.query(
      "SELECT attempts FROM users WHERE id = ?",
      [payload.id]
    );
    const attempts = attempts_obj[0].attempts;
    if (attempts === 1) {
      await pool.query(
        "UPDATE users SET status = ?, attempts = 0 WHERE id = ?",
        ["deactivated", payload.id]
      );
      try{
        logger.error("User deactivated, sending email");
        await sendEmail({
          to: payload.email,
          subject: "Account deactivated due to too many attempts",
          html: "<p>Contact support to reactivate your account</p>",
        });
        logger.info(`Email sent to ${payload.email} for account deactivation`);
        logger.error(`User deactivated with email ${payload.email}`);
        throw new UserDeactivatedError();
      }catch (error) {
        logger.error(`Error sending email for account deactivation: ${error}, ${payload.email}`);
        throw new InvalidEmailSendingError();
      }
    } else {
      await pool.query(
        "UPDATE users SET attempts = attempts - 1 WHERE id = ?",
        [payload.id]
      );
      logger.error(`Invalid email code for user ${payload.email}, attempts left: ${attempts - 1}`);
      throw new InvalidEmailCodeError();
      
    }
  }

  async getUser(contact) {
    const id = contact.id;
    let rows;
    if (!id) {
      [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [contact.email]);
    } else {
      [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    }
    if (rows.length === 0) {
      logger.error("User not found");
      throw new UserNotFoundError();
    }

    return new Contact({
      id: rows[0].id,
      email: rows[0].email,
      password: rows[0].password,
      email_code: rows[0].email_code,
      emailstatus: rows[0].emailstatus,
      attempts: rows[0].attempts,
      role: rows[0].role,
      status: rows[0].status,
      name: rows[0].name,
      surname: rows[0].surname,
      NIF: rows[0].NIF,
      CIF: rows[0].CIF,
      address: rows[0].address,
      url: rows[0].url,
    });
  }

  async validateLogin(contact) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [contact.email]
    );
    if (rows.length === 0) {
     logger.error(`Email not registered: ${contact.email}`);
      throw new EmailNotRegisteredError();
    }
    const user = rows[0];
    if (user.emailstatus === 0) {
      logger.error(`Email not validated: ${contact.email}`);
      throw new InvalidEmailValidationError();
    }
    const isValidPassword = await bcrypt.compare(contact.password, user.password_hash);
    if (!isValidPassword) {
      logger.error(`Invalid password for email: ${contact.email}`);
      throw new InvalidPasswordMatchError();
    }
  }

  async onBoardingCompany(payload, contact) {
    await pool.query(
      "UPDATE users SET name = ?, CIF = ?, address = ?, role = ? WHERE id = ?",
      [contact.name, contact.CIF, contact.address, "company", payload.id]
    );
  }

  async onBoardingUser(payload, contact) {
    await pool.query(
      "UPDATE users SET name = ?, NIF = ?, surname = ?, role = ? WHERE id = ?",
      [contact.name, contact.NIF, contact.surname,"personal_user",payload.id]
    );
  }

  async urlUpload(id, url) {
    await pool.query(
      "UPDATE users SET url = ? WHERE id = ?",
      [url, id]
    );
  }

  async deleteContact(id, soft = true) {
    if (soft) {
      await pool.query(
        "UPDATE users SET status = 'deleted' WHERE id = ?",
        [id]
      );
    } else {
      await pool.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );
    }
  }

  async passwordRecovery(mail, codeRecovery) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? ",
      [mail]
    );
    if (rows.length === 0) {
      logger.error(`Email not registered or not founf: ${mail}`);
      throw new EmailNotRegisteredError();
    }
    await pool.query(
      "UPDATE users SET codeRecovery = ? WHERE email = ?",
      [codeRecovery, mail]
    );
  }

  async newPassword(mail, codeRecovery, password) {
    const [rows] = await pool.query(
      "SELECT codeRecovery, id FROM users WHERE email = ?",
      [mail]
    );
    if (rows.length === 0) {
      logger.error(`Email not registered or not founf: ${mail}`);
      throw new EmailNotRegisteredError();
    }
    const codeRecovery_db = rows[0].codeRecovery;
    const id = rows[0].id;

    if (codeRecovery_db === codeRecovery) {
      await pool.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [password, id ]
      );
      return true;
    }
    return false;
  }

  async summarize() {
    const [result] = await pool.query(
      "SELECT SUM(CASE WHEN emailstatus = 1 AND status = 'active' THEN 1 ELSE 0 END) AS numActiveUsers, SUM(CASE WHEN status = 'deleted' THEN 1 ELSE 0 END) AS numDeletedUsers_soft, SUM(CASE WHEN emailstatus = 0 THEN 1 ELSE 0 END) AS numInactiveUsers, SUM(CASE WHEN emailstatus = 1 AND role = 'company' AND status = 'active' THEN 1 ELSE 0 END) AS numActiveCompanyUsers, SUM(CASE WHEN emailstatus = 1 AND role = 'personal_user' AND status = 'active' THEN 1 ELSE 0 END) AS numActivePersonalUsers, SUM(CASE WHEN status = 'deactivated' THEN 1 ELSE 0 END) AS numDeactivatedUsers FROM users;"
    );
    return result;
  }
}

module.exports = new ContactDAO();
