const GetUser = require('../../business/contact/useCases/getUser');
const jwt = require('../../infrastructure/web/utils/jwtToken');

jest.mock('../../infrastructure/web/utils/jwtToken');

describe('GetUser UseCase', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      getUser: jest.fn(),
    };
    useCase = new GetUser(contactDAO);
  });

  it('dovrebbe restituire JWT e publicDataCompany per utente azienda', async () => {
    const mockUser = {
      id: 1,
      role: 'company',
      publicDataCompany: { id: 1, name: 'Company SRL' }
    };

    contactDAO.getUser.mockResolvedValue(mockUser);
    jwt.generateHS256JWTexp.mockReturnValue('mocked.jwt.token');

    const result = await useCase.execute({ payload: { id: 1 } });

    expect(contactDAO.getUser).toHaveBeenCalledWith({ id: 1 });
    expect(result.jwt).toBe('mocked.jwt.token');
    expect(result.user).toEqual(mockUser.publicDataCompany);
  });

  it('dovrebbe restituire JWT e publicDataUser per utente normale', async () => {
    const mockUser = {
      id: 2,
      role: 'user',
      publicDataUser: { id: 2, name: 'Mario Rossi' }
    };

    contactDAO.getUser.mockResolvedValue(mockUser);
    jwt.generateHS256JWTexp.mockReturnValue('mocked.jwt.token.2');

    const result = await useCase.execute({ payload: { id: 2 } });

    expect(contactDAO.getUser).toHaveBeenCalledWith({ id: 2 });
    expect(result.jwt).toBe('mocked.jwt.token.2');
    expect(result.user).toEqual(mockUser.publicDataUser);
  });
});