const RestoreArchived = require('../../business/client/useCases/restoreClient');

describe('RestoreArchived Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      restoreArchived: jest.fn()
    };

    useCase = new RestoreArchived(mockDAO);
  });

  it('deve chiamare restoreArchived con clientId e userId e restituire un messaggio di successo', async () => {
    const input = { clientId: 42, userId: 1 };

    const result = await useCase.execute(input);

    expect(mockDAO.restoreArchived).toHaveBeenCalledWith(42, 1);
    expect(result).toEqual({
      message: "Client restored successfully"
    });
  });
});