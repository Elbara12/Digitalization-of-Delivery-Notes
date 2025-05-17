const logger = require("../../../infrastructure/web/utils/logger");
const { DeliveryNote } = require("../domain/deliveryNote");
const { DeliveryNoteEntries } = require("../domain/deliveryNoteEntries");
const { InvalidNoteFormatError }= require("../../error")

class InsertNote {
  constructor(noteDAO) {
    this.noteDAO = noteDAO;
  }

  async execute({ payload, data }) {
    logger.info("InsertNote use case started");

    if (!Array.isArray(data.entries)) {
    throw new InvalidNoteFormatError("Entries must be an array");
    }
  
    const note = new DeliveryNote({
      userId: payload.id,
      clientId: data.clientId,
      projectId: data.projectId,
    });
    
    const savedNote = await this.noteDAO.insertNote(note);

    const NoteEntries = [];
    for (const entryData of data.entries) {
      const entry = new DeliveryNoteEntries({
        deliveryNoteId: savedNote.id,
        type: entryData.type,
        person: entryData.person || null,
        hours: entryData.hours || null,
        material: entryData.material || null,
        quantity: entryData.quantity || null,
        description: entryData.description,
        workdate: entryData.workdate,
      });

      const inserted = await this.noteDAO.insertEntry(entry);
      NoteEntries.push(inserted);
    }

    logger.info("InsertNote use case finished");

      return {
        Note: savedNote.publicData,
        Entries: NoteEntries.map(e => e.publicData),
        message: "Note created successfully"
    }
  }
}

module.exports =  InsertNote ;
