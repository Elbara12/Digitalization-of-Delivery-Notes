const { ProjectController } = require('../../infrastructure/web/controller/projectController');
const InsertProject = require('../../business/project/useCases/insertProject');
const Update = require('../../business/project/useCases/update');
const GetProjects = require('../../business/project/useCases/getProjects');
const GetProjectById = require('../../business/project/useCases/getProjectById');
const DeleteProject = require('../../business/project/useCases/deleteProject');
const GetArchived = require('../../business/project/useCases/getArchived');
const RestoreProject = require('../../business/project/useCases/restoreProject');

describe('ProjectController', () => {
  let controller;
  let projectDAO;

  beforeEach(() => {
    projectDAO = {};
    controller = new ProjectController(projectDAO);
  });

  it('should register a project', async () => {
    InsertProject.prototype.execute = jest.fn().mockResolvedValue('created');
    const result = await controller.registration({ user: { id: 1 }, body: {} });
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('created');
  });

  it('should fail registration', async () => {
    InsertProject.prototype.execute = jest.fn().mockRejectedValue(new Error('error'));
    const result = await controller.registration({ user: { id: 1 }, body: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('error');
  });

  it('should update a project', async () => {
    Update.prototype.execute = jest.fn().mockResolvedValue('updated');
    const result = await controller.update({ user: { id: 1 }, body: {}, params: { projectId: ':5' } });
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('updated');
  });

  it('should fail update', async () => {
    Update.prototype.execute = jest.fn().mockRejectedValue(new Error('update failed'));
    const result = await controller.update({ user: { id: 1 }, body: {}, params: { projectId: ':5' } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('update failed');
  });

  it('should get all projects', async () => {
    GetProjects.prototype.execute = jest.fn().mockResolvedValue('list');
    const result = await controller.getProjects({ user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('list');
  });

  it('should handle error in getProjects', async () => {
    GetProjects.prototype.execute = jest.fn().mockRejectedValue(new Error('get error'));
    const result = await controller.getProjects({ user: { id: 1 } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('get error');
  });

  it('should get a project by ID', async () => {
    GetProjectById.prototype.execute = jest.fn().mockResolvedValue('project');
    const result = await controller.getProjectById({ user: { id: 1 }, params: { projectId: ':7' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('project');
  });

  it('should handle error in getProjectById', async () => {
    GetProjectById.prototype.execute = jest.fn().mockRejectedValue(new Error('not found'));
    const result = await controller.getProjectById({ user: { id: 1 }, params: { projectId: ':10' } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('not found');
  });

  it('should delete a project (soft)', async () => {
    DeleteProject.prototype.execute = jest.fn().mockResolvedValue('deleted');
    const result = await controller.delete({ user: { id: 1 }, params: { projectId: ':8' }, query: { soft: 'true' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('deleted');
  });

  it('should handle error in delete', async () => {
    DeleteProject.prototype.execute = jest.fn().mockRejectedValue(new Error('delete failed'));
    const result = await controller.delete({ user: { id: 1 }, params: { projectId: ':8' }, query: { soft: 'false' } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('delete failed');
  });

  it('should get archived projects', async () => {
    GetArchived.prototype.execute = jest.fn().mockResolvedValue('archived');
    const result = await controller.getArchived({ user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('archived');
  });

  it('should handle error in getArchived', async () => {
    GetArchived.prototype.execute = jest.fn().mockRejectedValue(new Error('archived error'));
    const result = await controller.getArchived({ user: { id: 1 } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('archived error');
  });

  it('should restore an archived project', async () => {
    RestoreProject.prototype.execute = jest.fn().mockResolvedValue('restored');
    const result = await controller.restoreArchived({ user: { id: 1 }, params: { projectId: ':9' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('restored');
  });

  it('should handle error in restoreArchived', async () => {
    RestoreProject.prototype.execute = jest.fn().mockRejectedValue(new Error('restore error'));
    const result = await controller.restoreArchived({ user: { id: 1 }, params: { projectId: ':10' } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('restore error');
  });
});