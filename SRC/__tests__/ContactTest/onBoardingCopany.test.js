const OnBoardingCompany = require('../../business/contact/useCases/onBoardingCompany');
const jwt = require('../../infrastructure/web/utils/jwtToken');

jest.mock('../../infrastructure/web/utils/jwtToken');

describe('OnBoardingCompany Use Case', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      onBoardingCompany: jest.fn(),
      getUser: jest.fn(),
    };

    useCase = new OnBoardingCompany(mockDAO);
  });

  it('should complete onboarding and return jwt and public company data', async () => {
    const payload = { id: 1 };
    const contact = { name: 'Company SRL', CIF: 'ABC123', address: {} };
    const mockUser = {
      publicDataCompany: { id: 1, name: 'Company SRL', role: 'company' }
    };

    mockDAO.getUser.mockResolvedValue(mockUser);
    jwt.generateHS256JWTexp.mockReturnValue('jwt-token');

    const result = await useCase.execute({ payload, contact });

    expect(mockDAO.onBoardingCompany).toHaveBeenCalledWith(payload, contact);
    expect(mockDAO.getUser).toHaveBeenCalledWith(payload);
    expect(jwt.generateHS256JWTexp).toHaveBeenCalledWith(mockUser, process.env.JWT_SECRET);
    expect(result).toEqual({
      jwt: 'jwt-token',
      user: mockUser.publicDataCompany,
    });
  });
});