const DeleteNote = require("../../business/deliveryNote/useCases/deleteNote");

describe("DeleteNote UseCase", () => {
  let mockNoteDAO;
  let useCase;

  beforeEach(() => {
    mockNoteDAO = {
      deleteNote: jest.fn()
    };
    useCase = new DeleteNote(mockNoteDAO);
  });

  it("should call deleteNote and return success message", async () => {
    const noteId = 42;
    const userId = 7;

    const result = await useCase.execute({ noteId, userId });

    expect(mockNoteDAO.deleteNote).toHaveBeenCalledWith(noteId, userId);
    expect(result).toEqual({
      message: `Note ${noteId} deleted successfully`,
    });
  });
});