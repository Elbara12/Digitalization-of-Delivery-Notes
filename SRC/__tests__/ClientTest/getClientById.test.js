const GetClientById = require('../../business/client/useCases/getClientById');

describe('GetClientById Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getClientById: jest.fn(async (clientId, route, userId) => ({
        publicData: {
          id: clientId,
          name: 'Test Client',
          CIF: 'ABC123456',
          address: {},
          archived: false,
          user_id: userId
        }
      }))
    };

    useCase = new GetClientById(mockDAO);
  });

  it('restituisce un client dato il suo ID e userId', async () => {
    const clientId = 42;
    const userId = 1;

    const result = await useCase.execute({ clientId, userId });

    expect(mockDAO.getClientById).toHaveBeenCalledWith(clientId, true, userId);
    expect(result).toHaveProperty('client');
    expect(result.client).toHaveProperty('id', clientId);
    expect(result.message).toBe("Client retrieved successfully");
  });
});