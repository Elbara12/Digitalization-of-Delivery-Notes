const logger = require("../../../infrastructure/web/utils/logger");

class DeleteNote {
  constructor(noteDAO) {
    this.noteDAO = noteDAO;
  }

  async execute({ noteId, userId }) {
    logger.info("DeleteNote use case started");
      await this.noteDAO.deleteNote(noteId, userId);
    logger.info("DeleteNote use case finished");
      return {
        message: `Note ${ noteId } deleted successfully`,
      }
  }
}

module.exports = DeleteNote;