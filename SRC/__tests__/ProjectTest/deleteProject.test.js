const DeleteProject = require("../../business/project/useCases/deleteProject");

describe("DeleteProject UseCase", () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      deleteProject: jest.fn()
    };
    useCase = new DeleteProject(mockDAO);
  });

  it("should soft delete a project", async () => {
    const id = 1;
    const soft = true;
    const payload = { id: 10 };

    const result = await useCase.execute({ id, soft, payload });

    expect(mockDAO.deleteProject).toHaveBeenCalledWith(id, soft, payload);
    expect(result).toEqual({ Message: "Project soft deleted" });
  });

  it("should hard delete a project", async () => {
    const id = 2;
    const soft = false;
    const payload = { id: 20 };

    const result = await useCase.execute({ id, soft, payload });

    expect(mockDAO.deleteProject).toHaveBeenCalledWith(id, soft, payload);
    expect(result).toEqual({ Message: "Project deleted" });
  });

  it("should soft delete a project by default when soft is not provided", async () => {
  const id = 3;
  const payload = { id: 30 };

  const result = await useCase.execute({ id, payload }); // soft non specificato

  expect(mockDAO.deleteProject).toHaveBeenCalledWith(id, true, payload);
  expect(result).toEqual({ Message: "Project soft deleted" });
});
});