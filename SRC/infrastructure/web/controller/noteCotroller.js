const logger = require('../utils/logger');
const InsertNote = require('../../../business/deliveryNote/useCases/insertNote');
const GetNotes = require('../../../business/deliveryNote/useCases/getNotes');
const GetNoteById = require('../../../business/deliveryNote/useCases/getNoteById');
const GeneratePDF = require('../../../business/deliveryNote/useCases/generatePDF');
const UrlUpload = require('../../../business/deliveryNote/useCases/urlUpload');
const DeleteNote = require('../../../business/deliveryNote/useCases/deleteNote');
const { note } = require('pdfkit');

class NoteController {
    constructor(noteDAO) {
      this.noteDAO = noteDAO;
    }

    async create(req){
        logger.info('Create request received for Note');
        try {
          const insertNote = new InsertNote(this.noteDAO);
          const result = await insertNote.execute({payload:req.user,data:req.body});
          return { statusCode: 201, payload: result };
        } catch (error) {
          logger.error('Error in create:', {
            errorMsg: error.message,
            errorStk: error.stack
          });
          return { statusCode: error.statusCode || 400, payload: { error: error.message } };
        }
    }

    async getAll(req) {
    logger.info("GET /api/deliverynote - Request received");
    try {
      const getNotes = new GetNotes(this.noteDAO);
      const result = await getNotes.execute({ payload: req.user });
      return { statusCode: 200, payload: result };
    } catch (error) {
      logger.error("Error in getAll delivery notes", {
        errorMsg: error.message,
        errorStk: error.stack,
      });
      return { statusCode: error.statusCode || 500, payload: { error: error.message } };
    }
  }

  async getNoteById(req) {
    logger.info(`GET /api/deliverynote/${req.params.noteId}`);
    try {
      const noteId = parseInt(req.params.noteId.replace(':', ''), 10)
      const getNoteById = new GetNoteById(this.noteDAO);
      const result = await getNoteById.execute({ noteId, userId: req.user.id });
      return { statusCode: 200, payload: result };
    } catch (error) {
      logger.error("Error in get delivery note by id", {
        errorMsg: error.message,
        errorStk: error.stack,
      });
      return { statusCode: 500, payload: { error: error.message } };
    }
  }

  async downloadPdf(req) {

  try {
    const generateAndUploadPdfUseCase = new GeneratePDF(this.noteDAO);
    const noteId = parseInt(req.params.noteId.replace(':', ''), 10)
    const { url } = await generateAndUploadPdfUseCase.execute({
      id: noteId,
      userId: req.user.id,
    });

    return {
      statusCode: 200,
      payload: { url },
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 400,
      payload: { error: error.message },
    };
  }
}

  async urlUpload(req) {
          logger.info("Sign requested");
          try {
            const noteId = parseInt(req.params.noteId.replace(':', ''), 10)
            const urlUpload = new UrlUpload(this.noteDAO);
            const result = await urlUpload.execute({payload: req.user, noteId, filePath: req.file.path});
            return { statusCode: 200, payload: result };
          } catch (error) {
            logger.error('Error in upload URL:', {
              errorMsg: error.message,
              errorStk: error.stack
            });
            return { statusCode: error.statusCode || 400, payload: { error: error.message } };
          }
  }

  async delete(req){
    logger.info('Delete request received for Note');
    try {
      const noteId = parseInt(req.params.noteId.replace(':', ''), 10)
      const deleteNote = new DeleteNote(this.noteDAO);
      const result = await deleteNote.execute({noteId, userId: req.user.id});
      return { statusCode: 200, payload: result };
    } catch (error) {
      logger.error('Error in delete:', {
        errorMsg: error.message,
        errorStk: error.stack
      });
      return { statusCode: error.statusCode || 400, payload: { error: error.message } };
    }
  }
}


module.exports = { NoteController } ; 