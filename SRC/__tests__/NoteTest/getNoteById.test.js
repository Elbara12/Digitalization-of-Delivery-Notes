const GetNoteById = require("../../business/deliveryNote/useCases/getNoteById");
const { NoteNotFoundError } = require("../../business/error");

describe("GetNoteById UseCase", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getById: jest.fn()
    };
    useCase = new GetNoteById(mockDAO);
  });

  it("should return the note if found", async () => {
    const noteId = 1;
    const userId = 10;
    const mockNote = { id: noteId, projectId: 2, signed: false };

    mockDAO.getById.mockResolvedValue(mockNote);

    const result = await useCase.execute({ noteId, userId });

    expect(mockDAO.getById).toHaveBeenCalledWith(noteId, userId);
    expect(result).toEqual(mockNote);
  });

  it("should throw NoteNotFoundError if note is not found", async () => {
    const noteId = 999;
    const userId = 1;

    mockDAO.getById.mockResolvedValue(null);

    await expect(useCase.execute({ noteId, userId })).rejects.toThrow(NoteNotFoundError);
    expect(mockDAO.getById).toHaveBeenCalledWith(noteId, userId);
  });
});