const ValidateMail = require('../../business/contact/useCases/validateMail');
const jwt = require('../../infrastructure/web/utils/jwtToken');

jest.mock('../../infrastructure/web/utils/jwtToken');

describe('ValidateMail Use Case', () => {
  let contactDAO;
  let useCase;

  const mockPayload = { id: 1, email: 'user@test.com' };
  const mockEmailCode = '123456';
  const mockUser = {
    id: 1,
    email: 'user@test.com',
    publicData: {
      id: 1,
      email: 'user@test.com',
      role: 'user',
    },
  };

  beforeEach(() => {
    contactDAO = {
      validateMail: jest.fn().mockResolvedValue(),
      getUser: jest.fn().mockResolvedValue(mockUser),
    };
    jwt.generateHS256JWTexp = jest.fn().mockReturnValue('mocked.jwt.token');

    useCase = new ValidateMail(contactDAO);
  });

  it('should validate email and return jwt and contact data', async () => {
    const result = await useCase.execute({ payload: mockPayload, email_code: mockEmailCode });

    expect(contactDAO.validateMail).toHaveBeenCalledWith(mockPayload, mockEmailCode);
    expect(contactDAO.getUser).toHaveBeenCalledWith(mockPayload);
    expect(jwt.generateHS256JWTexp).toHaveBeenCalledWith(mockUser, process.env.JWT_SECRET);

    expect(result).toEqual({
      jwt: 'mocked.jwt.token',
      contact: mockUser.publicData,
      message: 'Email validated successfully',
    });
  });
});