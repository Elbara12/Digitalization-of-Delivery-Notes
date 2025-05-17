const GetProjectById = require('../../business/project/useCases/getProjectById');
const { ProjectNotFoundError } = require('../../business/error');

describe('GetProjectById UseCase', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getProjectById: jest.fn()
    };

    useCase = new GetProjectById(mockDAO);
  });

  it('should return project data if found', async () => {
    const mockProject = {
      publicData: {
        id: 1,
        name: 'Project X',
        email: 'project@example.com'
      }
    };

    mockDAO.getProjectById.mockResolvedValue(mockProject);

    const result = await useCase.execute({
      projectId: 1,
      payload: { id: 10 }
    });

    expect(mockDAO.getProjectById).toHaveBeenCalledWith(1, true, 10);
    expect(result.project).toEqual(mockProject.publicData);
    expect(result.message).toBe('Project retrieved successfully');
  });

  it('should throw error if project is not found', async () => {
    mockDAO.getProjectById.mockRejectedValue(new ProjectNotFoundError());

    await expect(
      useCase.execute({ projectId: 999, payload: { id: 10 } })
    ).rejects.toThrow(ProjectNotFoundError);
  });
});