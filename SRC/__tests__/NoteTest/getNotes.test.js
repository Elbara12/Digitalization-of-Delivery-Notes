const GetNotes = require("../../business/deliveryNote/useCases/getNotes");

describe("GetNotes UseCase", () => {
  let mockNoteDAO;
  let useCase;

  beforeEach(() => {
    mockNoteDAO = {
      getNotesByUserId: jest.fn()
    };
    useCase = new GetNotes(mockNoteDAO);
  });

  it("should fetch notes and return them", async () => {
    const payload = { id: 1 };
    const mockNotes = [
      { id: 101, projectId: 5, signed: false },
      { id: 102, projectId: 6, signed: true }
    ];

    mockNoteDAO.getNotesByUserId.mockResolvedValue(mockNotes);

    const result = await useCase.execute({ payload });

    expect(mockNoteDAO.getNotesByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockNotes);
  });
});