const GetArchived = require("../../business/project/useCases/getArchived");

describe("GetArchived Project Use Case", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getArchived: jest.fn(async (userId) => [
        { id: 1, name: "Archived Project", archived: true },
      ])
    };

    useCase = new GetArchived(mockDAO);
  });

  it("should return archived projects for the user", async () => {
    const payload = { id: 1 };

    const result = await useCase.execute({ payload });

    expect(mockDAO.getArchived).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      projects: [
        { id: 1, name: "Archived Project", archived: true },
      ],
      message: "Archived projects retrieved successfully"
    });
  });
});