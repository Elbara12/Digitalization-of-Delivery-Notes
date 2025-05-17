const RestoreArchived = require('../../business/project/useCases/restoreProject');

describe("RestoreArchived Use Case", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      restoreArchived: jest.fn(async () => {})
    };
    useCase = new RestoreArchived(mockDAO);
  });

  it("should restore an archived project", async () => {
    const projectId = 1;
    const userId = 10;

    const result = await useCase.execute({ projectId, userId });

    expect(mockDAO.restoreArchived).toHaveBeenCalledWith(projectId, userId);
    expect(result).toEqual({ message: "Project restored successfully" });
  });
});