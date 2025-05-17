const GetArchived = require('../../business/client/useCases/getArchived');

describe('GetArchived Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      getArchived: jest.fn(async () => [
        { id: 1, name: 'Client A' },
        { id: 2, name: 'Client B' }
      ])
    };

    useCase = new GetArchived(mockDAO);
  });

  it('restituisce i clienti archiviati', async () => {
    const payload = { id: 1 };

    const result = await useCase.execute({ payload });

    expect(mockDAO.getArchived).toHaveBeenCalledWith(1);
    expect(result).toHaveProperty('clients');
    expect(result.clients).toHaveLength(2);
    expect(result.message).toBe("Archived clients retrieved successfully");
  });
});