const GeneratePDF = require("../../business/deliveryNote/useCases/generatePDF");
const { generateDeliveryNotePDF } = require("../../infrastructure/web/utils/pdfGenerator");
const { uploadPDFBufferToPinata } = require("../../infrastructure/web/services/ipfsPdfUploader");

jest.mock("../../infrastructure/web/utils/pdfGenerator");
jest.mock("../../infrastructure/web/services/ipfsPdfUploader");

describe("GeneratePDF", () => {
  let noteDAO;
  let useCase;

  beforeEach(() => {
    noteDAO = {
      getById: jest.fn(),
      updatePdfUrl: jest.fn(),
    };

    useCase = new GeneratePDF(noteDAO);
  });

  it("genera e carica un PDF su IPFS correttamente", async () => {
    const mockData = {
      user: { name: "Matteo", email: "user@test.com" },
      client: { name: "ClientX", CIF: "ABC123" },
      project: { name: "Proj", email: "project@x.com" },
      note: { id: 42, created_at: new Date() },
      entries: [],
      signatureUrl: null
    };

    noteDAO.getById.mockResolvedValue(mockData);
    generateDeliveryNotePDF.mockResolvedValue(Buffer.from("PDF CONTENT"));
    uploadPDFBufferToPinata.mockResolvedValue("https://ipfs.url/file.pdf");

    const result = await useCase.execute({ id: 42, userId: 7 });

    expect(noteDAO.getById).toHaveBeenCalledWith(42, 7);
    expect(generateDeliveryNotePDF).toHaveBeenCalledWith(mockData);
    expect(uploadPDFBufferToPinata).toHaveBeenCalled();
    expect(noteDAO.updatePdfUrl).toHaveBeenCalledWith(7, 42, "https://ipfs.url/file.pdf");

    expect(result).toEqual({ url: "https://ipfs.url/file.pdf" });
  });

  it("lancia errore se la nota non esiste", async () => {
    noteDAO.getById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 99, userId: 1 })).rejects.toThrow("Note not found or archived");
  });
});