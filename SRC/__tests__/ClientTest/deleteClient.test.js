const Delete = require('../../business/client/useCases/delete');

describe('Delete Client Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      deleteClient: jest.fn()
    };
    useCase = new Delete(mockDAO);
  });

  it('should soft delete a client', async () => {
    const id = 5;
    const soft = true;

    const result = await useCase.execute({ id, soft });

    expect(mockDAO.deleteClient).toHaveBeenCalledWith(id, soft);
    expect(result).toEqual({ Message: "Client soft deleted" });
  });

  it('should hard delete a client', async () => {
    const id = 10;
    const soft = false;

    const result = await useCase.execute({ id, soft });

    expect(mockDAO.deleteClient).toHaveBeenCalledWith(id, soft);
    expect(result).toEqual({ Message: "Client deleted" });
  });

  it('should default to soft delete when "soft" is not provided', async () => {
    const id = 7;

    const result = await useCase.execute({ id });

    expect(mockDAO.deleteClient).toHaveBeenCalledWith(id, true);
    expect(result).toEqual({ Message: "Client soft deleted" });
  });
});