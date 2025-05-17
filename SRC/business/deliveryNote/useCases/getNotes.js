const logger = require("../../../infrastructure/web/utils/logger");

class GetNotes {
  constructor(noteDAO) {
    this.noteDAO = noteDAO;
  }

  async execute({ payload }) {
      logger.info(`Fetching delivery notes for user ${payload.id}`);
      const notes = await this.noteDAO.getNotesByUserId(payload.id);

      logger.info(`Found ${notes.length} delivery notes for user ${payload.id}`);
      return notes;
  }
}

module.exports = GetNotes;