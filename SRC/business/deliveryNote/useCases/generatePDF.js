const {generateDeliveryNotePDF} = require('../../../infrastructure/web/utils/pdfGenerator');
const { uploadPDFBufferToPinata } = require('../../../infrastructure/web/services/ipfsPdfUploader');
const logger = require("../../../infrastructure/web/utils/logger");
const { NoteNotFoundError } = require("../../error");

class GeneratePDF {
  constructor(noteDAO) {
    this.noteDAO = noteDAO;
  }

  async execute({ id, userId }) {
    logger.info(`Generating PDF for delivery note with ID ${id}`);
    const data = await this.noteDAO.getById(id, userId);
    if (!data) throw new NoteNotFoundError();
    const pdfBuffer = await generateDeliveryNotePDF(data);
    const fileName = `delivery_note_${id}.pdf`;
    const ipfsUrl = await uploadPDFBufferToPinata(pdfBuffer, fileName);
    await this.noteDAO.updatePdfUrl( userId, id, ipfsUrl);
    logger.info(`PDF generated and uploaded to IPFS for delivery note ID ${id}`);
    return { url: ipfsUrl };
  }
}

module.exports = GeneratePDF;