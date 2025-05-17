const ValidateLogin = require('../../business/contact/useCases/validateLogin');
const jwt = require('../../infrastructure/web/utils/jwtToken');

jest.mock('../../infrastructure/web/utils/jwtToken');

describe('ValidateLogin Use Case', () => {
  let contactDAO;
  let useCase;

  const mockContact = { email: 'test@example.com' };
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    publicData: {
      id: 1,
      email: 'test@example.com',
      role: 'user',
    },
  };

  beforeEach(() => {
    contactDAO = {
      validateLogin: jest.fn(),
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    jwt.generateHS256JWTexp = jest.fn().mockReturnValue('mocked.jwt.token');
    useCase = new ValidateLogin(contactDAO);
  });

  it('should validate login and return jwt and user data', async () => {
    const result = await useCase.execute({ contact: mockContact });

    expect(contactDAO.validateLogin).toHaveBeenCalledWith(mockContact);
    expect(contactDAO.getUser).toHaveBeenCalledWith(mockContact);
    expect(jwt.generateHS256JWTexp).toHaveBeenCalledWith(mockUser, process.env.JWT_SECRET);

    expect(result).toEqual({
      jwt: 'mocked.jwt.token',
      user: mockUser.publicData,
      message: 'Login successful',
    });
  });
});