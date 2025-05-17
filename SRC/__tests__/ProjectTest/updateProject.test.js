const Update = require('../../business/project/useCases/update');

describe("Update Project Use Case", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      UpdateProject: jest.fn(async () => {}),
      getProjectById: jest.fn(async () => ({
        publicData: { id: 1, name: "Updated Project" }
      }))
    };

    useCase = new Update(mockDAO);
  });

  it("should update a project and return the updated data", async () => {
    const payload = { id: 1 };
    const projectId = 123;
    const project = { name: "Updated Project" };

    const result = await useCase.execute({ payload, projectId, project });

    expect(mockDAO.UpdateProject).toHaveBeenCalledWith(project, projectId, payload);
    expect(mockDAO.getProjectById).toHaveBeenCalledWith(projectId);
    expect(result).toEqual({
      project: { id: 1, name: "Updated Project" },
      message: "Project updated successfully"
    });
  });
});