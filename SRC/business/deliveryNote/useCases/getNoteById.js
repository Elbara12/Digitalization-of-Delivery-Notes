const logger = require("../../../infrastructure/web/utils/logger");
const { NoteNotFoundError } = require("../../error");

class GetNoteById {
  constructor(noteDAO) {
    this.noteDAO = noteDAO;
  }

  async execute({ noteId, userId }) {
    logger.info(`Fetching delivery note with ID ${noteId}`);
    const note = await this.noteDAO.getById(noteId, userId);
    if (!note) throw new NoteNotFoundError();
    logger.info(`Found delivery note with ID ${noteId}`);
    return note;
  }
}

module.exports = GetNoteById;