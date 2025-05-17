const UrlUpload = require("../../business/deliveryNote/useCases/urlUpload");
const UploadPinata = require("../../infrastructure/web/services/ipfsUploader");

jest.mock("../../infrastructure/web/services/ipfsUploader");

describe("UrlUpload UseCase", () => {
  let noteDAO;
  let useCase;

  beforeEach(() => {
    noteDAO = {
      urlUpload: jest.fn(),
    };

    UploadPinata.mockClear();
    useCase = new UrlUpload(noteDAO);
  });

  it("should upload file to IPFS and update note", async () => {
    const payload = { id: 1 };
    const noteId = 42;
    const filePath = "/tmp/file.png";
    const mockUrl = "https://gateway.pinata.cloud/ipfs/testhash";

    UploadPinata.mockResolvedValue(mockUrl);

    const result = await useCase.execute({ payload, noteId, filePath });

    expect(UploadPinata).toHaveBeenCalledWith(filePath);
    expect(noteDAO.urlUpload).toHaveBeenCalledWith(payload.id, noteId, mockUrl);
    expect(result).toEqual({ message: "Delivery note signed", Url: mockUrl });
  });
});