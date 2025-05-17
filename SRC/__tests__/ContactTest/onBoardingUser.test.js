const OnBoardingUser = require('../../business/contact/useCases/onBoardingUser');
const jwt = require('../../infrastructure/web/utils/jwtToken');

jest.mock('../../infrastructure/web/utils/jwtToken');

describe('OnBoardingUser Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      onBoardingUser: jest.fn(),
      getUser: jest.fn(),
    };
    useCase = new OnBoardingUser(mockDAO);
  });

  it('should complete onboarding for user and return jwt and public user data', async () => {
    const payload = { email: 'user@example.com' };
    const contact = { name: 'Mario', surname: 'Rossi', NIF: 'ABC123' };
    const mockUser = {
      publicDataUser: {
        id: 1,
        name: 'Mario',
        surname: 'Rossi',
        email: 'user@example.com',
        role: 'user',
      }
    };

    mockDAO.getUser.mockResolvedValue(mockUser);
    jwt.generateHS256JWTexp.mockReturnValue('jwt-user-token');

    const result = await useCase.execute({ payload, contact });

    expect(mockDAO.onBoardingUser).toHaveBeenCalledWith(payload, contact);
    expect(mockDAO.getUser).toHaveBeenCalledWith(payload);
    expect(jwt.generateHS256JWTexp).toHaveBeenCalledWith(mockUser, process.env.JWT_SECRET);
    expect(result).toEqual({
      jwt: 'jwt-user-token',
      user: mockUser.publicDataUser,
    });
  });
});