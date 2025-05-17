const UrlUpload = require('../../business/contact/useCases/urlUpload');
const jwt = require('../../infrastructure/web/utils/jwtToken');
const UploadPinata = require('../../infrastructure/web/services/ipfsUploader');

jest.mock('../../infrastructure/web/services/ipfsUploader');
jest.mock('../../infrastructure/web/utils/jwtToken');

describe('UrlUpload Use Case', () => {
  let contactDAO;
  let useCase;

  const mockUser = {
    id: 1,
    role: 'company',
    publicDataCompany: { id: 1, email: 'company@test.com' },
    publicDataUser: { id: 1, email: 'user@test.com' }
  };

  beforeEach(() => {
    contactDAO = {
      urlUpload: jest.fn(),
      getUser: jest.fn().mockResolvedValue(mockUser),
    };

    UploadPinata.mockResolvedValue('https://ipfs.example.com/image.png');
    jwt.generateHS256JWTexp = jest.fn().mockReturnValue('mocked.jwt.token');

    useCase = new UrlUpload(contactDAO);
  });

  it('should upload image and return data for a company', async () => {
    const payload = { id: 1 };
    const filePath = '/tmp/profile.png';

    const result = await useCase.execute({ payload, filePath });

    expect(UploadPinata).toHaveBeenCalledWith(filePath);
    expect(contactDAO.urlUpload).toHaveBeenCalledWith(1, 'https://ipfs.example.com/image.png');
    expect(contactDAO.getUser).toHaveBeenCalledWith(payload);
    expect(jwt.generateHS256JWTexp).toHaveBeenCalledWith(mockUser, process.env.JWT_SECRET);
    expect(result).toEqual({
      jwt: 'mocked.jwt.token',
      user: mockUser.publicDataCompany,
      message: "Profile image uploaded successfully",
    });
  });

  it('should upload image and return data for a regular user', async () => {
    mockUser.role = 'user';

    const result = await useCase.execute({ payload: { id: 1 }, filePath: '/tmp/img.png' });

    expect(result.user).toEqual(mockUser.publicDataUser);
    expect(result.message).toBe("Profile image uploaded successfully");
  });
});