const GetClient = require('../../business/client/useCases/getClient');

describe('GetClient Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getClients: jest.fn(async (userId) => [
        { id: 1, name: 'Client One' },
        { id: 2, name: 'Client Two' }
      ])
    };

    useCase = new GetClient(mockDAO);
  });

  it('restituisce i clienti associati all\'utente', async () => {
    const payload = { id: 1 };

    const result = await useCase.execute({ payload });

    expect(mockDAO.getClients).toHaveBeenCalledWith(1);
    expect(result).toHaveProperty('clients');
    expect(result.clients).toHaveLength(2);
    expect(result.message).toBe("Clients retrieved successfully");
  });
});