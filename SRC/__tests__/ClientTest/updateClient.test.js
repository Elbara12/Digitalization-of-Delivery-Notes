const Update = require('../../business/client/useCases/update');
const { Client } = require('../../business/client/domain/client');

describe('Update Client Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      updateClient: jest.fn(),
      getClientById: jest.fn(),
    };

    useCase = new Update(mockDAO);
  });

  it('should update client and return public data', async () => {
    const payload = { id: 1 };
    const client = {
      client_id: 10,
      name: 'Updated Client',
      CIF: 'XYZ123456',
      address: { city: 'Roma' }
    };

    const fakeClient = new Client({
      id: 10,
      name: client.name,
      CIF: client.CIF,
      address: client.address,
      user_id: payload.id
    });

    mockDAO.getClientById.mockResolvedValue(fakeClient);

    const result = await useCase.execute({ payload, client });

    expect(mockDAO.updateClient).toHaveBeenCalledWith(client, payload);
    expect(mockDAO.getClientById).toHaveBeenCalledWith(client.client_id);
    expect(result).toEqual({
      client: fakeClient.publicData,
      message: 'Client updated successfully',
    });
  });
});