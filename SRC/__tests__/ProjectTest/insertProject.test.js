const InsertProject = require('../../business/project/useCases/insertProject');
const { ProjectAlreadyExistsError } = require('../../business/error');
const { Project } = require('../../business/project/domain/project');

describe('InsertProject UseCase', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      checkPrj: jest.fn(),
      insert: jest.fn(async (project) => {
        project.id = 1;
        return project;
      }),
    };

    useCase = new InsertProject(mockDAO);
  });

  it('should create a project if it does not exist', async () => {
    const payload = { id: 1 };
    const project = {
      name: 'Test Project',
      email: 'test@example.com',
      address: { street: 'Main St', city: 'Rome' },
      clientId: 2
    };

    mockDAO.checkPrj.mockResolvedValue(false); // no duplicate

    const result = await useCase.execute({ payload, project });

    expect(mockDAO.checkPrj).toHaveBeenCalledWith(project.name, project.email);
    expect(mockDAO.insert).toHaveBeenCalled();
    expect(result.project).toHaveProperty('id', 1);
    expect(result.message).toBe('Project created successfully');
  });

  it('should throw ProjectAlreadyExistsError if duplicate found', async () => {
    const payload = { id: 1 };
    const project = {
      name: 'Duplicate Project',
      email: 'duplicate@example.com',
      address: {},
      clientId: 2
    };

    mockDAO.checkPrj.mockResolvedValue(true); // duplicate exists

    await expect(useCase.execute({ payload, project })).rejects.toThrow(ProjectAlreadyExistsError);
    expect(mockDAO.insert).not.toHaveBeenCalled();
  });
});