const pool = require('./db');
const logger = require("../../web/utils/logger");
const { DeliveryNote } = require("../../../business/deliveryNote/domain/deliveryNote")
const {
  InvalidDatabaseError,
  NoteNotFoundError,
  SignedNoteError,
  UserNotFoundError,
  ProjectNotFoundError,
  ClientNotFoundError,
  EntriesNotFoundError,
}= require("../../../business/error");

class noteDAO { 
    constructor() {
      this.init();
    }
  
    async init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS delivery_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        client_id INT NOT NULL,
        user_id INT NOT NULL,
        signed BOOLEAN DEFAULT false,
        signature_url TEXT,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS delivery_note_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        delivery_note_id INT NOT NULL,
        type ENUM('hours', 'material') NOT NULL,
        person VARCHAR(255),
        hours FLOAT,
        material VARCHAR(255),
        quantity FLOAT,
        description TEXT,
        workdate DATE NOT NULL,
        FOREIGN KEY (delivery_note_id) REFERENCES delivery_notes(id) ON DELETE CASCADE
      )
    `);

    logger.info("Tables 'delivery_notes' and 'delivery_note_entries' created or already exist");
  } catch (err) {
    logger.error("Error creating delivery notes tables:", err);
    throw new InvalidDatabaseError();
  }
}

async insertNote(deliveryNote) {
  const [res] = await pool.query(
    "INSERT INTO delivery_notes (user_id, client_id, project_id, signature_url, pdf_url) VALUES (?, ?, ?, ?, ?)",
    [deliveryNote.userId, deliveryNote.clientId, deliveryNote.projectId, deliveryNote.signatureUrl, deliveryNote.pdfUrl]
  );
  deliveryNote.id = res.insertId;
  return deliveryNote;
}

async insertEntry(entry) {
   const [res]=await pool.query(
    `INSERT INTO delivery_note_entries (delivery_note_id, type, person, hours, material, quantity, description, workdate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.deliveryNoteId,
      entry.type,
      entry.person,
      entry.hours,
      entry.material,
      entry.quantity,
      entry.description,
      entry.workdate
    ]
  );
  entry.id = res.insertId;
  return entry;
}

async getNotesByUserId(userId) {
  const [notes] = await pool.query(
    `SELECT * FROM delivery_notes WHERE user_id = ?`,
    [userId]
  );
  if (notes.length === 0) throw new NoteNotFoundError("No notes found for this user");

  const results = await Promise.all(
  notes.map(async (note) => {
    const [entries] = await pool.query(
      `SELECT * FROM delivery_note_entries WHERE delivery_note_id = ?`,
      [note.id]
    );

    return {
      ...note,
      entries,
    };
  })
);
  return results;
}

async getById(id, userId) {
  
  // Recupera la delivery note
  const [[note]] = await pool.query(`
    SELECT * FROM delivery_notes WHERE id = ? AND user_id = ?
  `, [id, userId]);

  if (!note) return null;
  
  // Recupera entries
  const [entries] = await pool.query(`
    SELECT * FROM delivery_note_entries WHERE delivery_note_id = ?
  `, [id]);

  if (!entries) throw new EntriesNotFoundError();
  // Recupera user
  const [[user]] = await pool.query(`
    SELECT id, name,email, role FROM users WHERE id = ?
  `, [note.user_id]);
  if (!user) throw new UserNotFoundError();
  // Recupera progetto
  const [[project]] = await pool.query(`
    SELECT * FROM projects WHERE id = ?
  `, [note.project_id]);

  if (!project) throw new ProjectNotFoundError();
  // Recupera client
  const [[client]] = await pool.query(`
    SELECT * FROM clients WHERE id = ?
  `, [project.client_id]);
  
  if (!client) throw new ClientNotFoundError();
  return {
    note,
    user,
    project,
    client,
    entries,
    signatureUrl: note.signature_url,
  };
}

async updatePdfUrl(userId, noteId, url) {
  const [res]=await pool.query(
    `UPDATE delivery_notes SET pdf_url = ? WHERE id = ? AND user_id = ?`,
    [url, noteId, userId]
  );
  if (res.affectedRows === 0) throw new NoteNotFoundError();
}

async urlUpload(userId, noteId, url) {
  await pool.query(
    `UPDATE delivery_notes SET signature_url = ?, signed = true WHERE id = ? AND user_id = ?`,
    [url, noteId, userId]
  );
}

async deleteNote(id, userId) {
  const [result] = await pool.query(
    `SELECT signed FROM delivery_notes WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  if (result.length === 0) {
    throw new NoteNotFoundError();
  }
  const signed= result[0].signed;
  if (signed) {
    throw new SignedNoteError();
  }
  await pool.query(
    `DELETE FROM delivery_notes WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  await pool.query(
    `DELETE FROM delivery_note_entries WHERE delivery_note_id = ?`,
    [id]
  );
}

}

module.exports = new noteDAO();