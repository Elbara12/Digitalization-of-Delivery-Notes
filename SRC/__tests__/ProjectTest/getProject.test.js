const GetProjects = require("../../business/project/useCases/getProjects");

describe("GetProjects Use Case", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getProjects: jest.fn(async (userId) => [
        { id: 1, name: "Test Project", archived: false }
      ])
    };

    useCase = new GetProjects(mockDAO);
  });

  it("should retrieve projects for a user", async () => {
    const payload = { id: 42 };

    const result = await useCase.execute({ payload });

    expect(mockDAO.getProjects).toHaveBeenCalledWith(42);
    expect(result).toEqual({
      projects: [
        { id: 1, name: "Test Project", archived: false }
      ],
      message: "Projects retrieved successfully"
    });
  });
});