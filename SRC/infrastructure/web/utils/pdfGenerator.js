const PDFDocument = require('pdfkit');
const getStream = require('get-stream');
const axios = require('axios');
const logger = require("./logger");

async function generateDeliveryNotePDF({ user, client, project, note, entries, signatureUrl }) {
  const doc = new PDFDocument();
  logger.info("Generating PDF for delivery note");
  // Aggiungi contenuti al PDF
  doc.fontSize(20).text('Delivery Note', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`User: ${user.name} (${user.email})`);
  doc.text(`Client: ${client.name} - CIF: ${client.CIF}`);
  doc.text(`Project: ${project.name} - Email: ${project.email}`);
  doc.text(`Date: ${new Date(note.created_at).toLocaleDateString()}`);
  doc.moveDown();
  doc.text('Entries:', { underline: true });
  entries.forEach((entry, index) => {
    doc.moveDown(0.5);
    doc.text(`Entry ${index + 1}:`);
    doc.text(`  Type: ${entry.type}`);
    doc.text(`  ${entry.type === 'hours' ? `Person: ${entry.person}, Hours: ${entry.hours}` : `Material: ${entry.material}, Quantity: ${entry.quantity}`}`);
    doc.text(`  Description: ${entry.description}`);
    doc.text(`  Workdate: ${new Date(entry.workdate).toLocaleDateString()}`);
  });
  if (signatureUrl) {
    doc.moveDown();
    doc.text('Signed:', { underline: true });
    try {
    const response = await axios.get(signatureUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    doc.image(imageBuffer, { fit: [200, 100], align: 'center' });
  } catch (err) {
    doc.text('Unable to load signature image');
    logger.error("Error loading signature from URL:", err.message);
  }
  }
  doc.end();
  logger.info("PDF generation completed");
  return await getStream.buffer(doc);
}

module.exports = { generateDeliveryNotePDF };