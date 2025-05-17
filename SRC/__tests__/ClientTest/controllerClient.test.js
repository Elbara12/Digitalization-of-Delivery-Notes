const { ClientController } = require('../../infrastructure/web/controller/clientController');
const InsertClient = require('../../business/client/useCases/insertClient');
const Update = require('../../business/client/useCases/update');
const GetClient = require('../../business/client/useCases/getClient');
const GetClientById = require('../../business/client/useCases/getClientById');
const Delete = require('../../business/client/useCases/delete');
const GetArchived = require('../../business/client/useCases/getArchived');
const RestoreClient = require('../../business/client/useCases/restoreClient');

describe('ClientController', () => {
  let controller;
  let clientDAO;

  beforeEach(() => {
    clientDAO = {}; // mocked DAO
    controller = new ClientController(clientDAO);
  });

  it('should handle client registration', async () => {
    const mockReq = { body: {}, user: {} };
    InsertClient.prototype.execute = jest.fn().mockResolvedValue('created');
    const result = await controller.registration(mockReq);
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('created');
  });

  it('should catch error in registration', async () => {
    InsertClient.prototype.execute = jest.fn().mockRejectedValue(new Error('fail'));
    const result = await controller.registration({ body: {}, user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('fail');
  });

  it('should handle update', async () => {
    const mockReq = { body: { id: 1 }, user: { id: 2 } };
    Update.prototype.execute = jest.fn().mockResolvedValue('updated');
    const result = await controller.update(mockReq);
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('updated');
  });

  it('should catch error in update', async () => {
    Update.prototype.execute = jest.fn().mockRejectedValue(new Error('update failed'));
    const result = await controller.update({ body: {}, user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('update failed');
  });

  it('should handle getClient', async () => {
    const mockReq = { user: { id: 1 } };
    GetClient.prototype.execute = jest.fn().mockResolvedValue('clients');
    const result = await controller.getClient(mockReq);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('clients');
  });

  it('should catch error in getClient', async () => {
    GetClient.prototype.execute = jest.fn().mockRejectedValue(new Error('get client failed'));
    const result = await controller.getClient({ user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('get client failed');
  });

  it('should handle getClientById', async () => {
    const mockReq = { params: { clientId: ':3' }, user: { id: 1 } };
    GetClientById.prototype.execute = jest.fn().mockResolvedValue('client');
    const result = await controller.getClientById(mockReq);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('client');
  });

  it('should catch error in getClientById', async () => {
    GetClientById.prototype.execute = jest.fn().mockRejectedValue(new Error('get by id failed'));
    const result = await controller.getClientById({ params: { clientId: ':1' }, user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('get by id failed');
  });

  it('should handle delete', async () => {
    const mockReq = { params: { clientId: ':4' }, query: { soft: 'true' } };
    Delete.prototype.execute = jest.fn().mockResolvedValue('deleted');
    const result = await controller.delete(mockReq);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('deleted');
  });

  it('should catch error in delete', async () => {
    Delete.prototype.execute = jest.fn().mockRejectedValue(new Error('delete failed'));
    const result = await controller.delete({ params: { clientId: ':1' }, query: { soft: 'true' } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('delete failed');
  });

  it('should handle getArchived', async () => {
    const mockReq = { user: { id: 1 } };
    GetArchived.prototype.execute = jest.fn().mockResolvedValue('archived');
    const result = await controller.getArchived(mockReq);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('archived');
  });

  it('should catch error in getArchived', async () => {
    GetArchived.prototype.execute = jest.fn().mockRejectedValue(new Error('archived failed'));
    const result = await controller.getArchived({ user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('archived failed');
  });

  it('should handle restoreArchived', async () => {
    const mockReq = { params: { clientId: ':5' }, user: { id: 1 } };
    RestoreClient.prototype.execute = jest.fn().mockResolvedValue('restored');
    const result = await controller.restoreArchived(mockReq);
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('restored');
  });

  it('should catch error in restoreArchived', async () => {
    RestoreClient.prototype.execute = jest.fn().mockRejectedValue(new Error('restore failed'));
    const result = await controller.restoreArchived({ params: { clientId: ':1' }, user: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('restore failed');
  });
});