const InsertContact = require('../../business/contact/useCases/insertContact');
const { Contact } = require('../../business/contact/domain/contact');
const {
  EmailAlreadyInUseError,
  InvalidEmailSendingError,
  InvalidPasswordError
} = require('../../business/error');
const bcrypt = require('bcrypt');
const jwt = require('../../infrastructure/web/utils/jwtToken');
const { sendEmail } = require('../../infrastructure/web/services/emailService');

jest.mock('bcrypt');
jest.mock('../../infrastructure/web/utils/jwtToken');
jest.mock('../../infrastructure/web/services/emailService');

describe('InsertContact Use Case', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      checkEmail: jest.fn(),
      insert: jest.fn(),
      deleteContact: jest.fn(),
    };
    useCase = new InsertContact(contactDAO);
  });

  it('should insert new contact and send email', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'securepass';
    const mockUser = new Contact({ email: mockEmail });
    mockUser.id = 1;
    mockUser.publicData = { id: 1, email: mockEmail };

    contactDAO.checkEmail.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('hashed_pw');
    contactDAO.insert.mockResolvedValue(mockUser);
    sendEmail.mockResolvedValue();
    jwt.generateHS256JWT.mockReturnValue('fake-jwt-token');

    const result = await useCase.execute({ email: mockEmail, password: mockPassword });

    expect(contactDAO.checkEmail).toHaveBeenCalledWith(mockEmail);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toEqual({
      jwt: 'fake-jwt-token',
      contact: mockUser.publicData,
      message: "Check your email for the validation code"
    });
  });

  it('should throw error if email already exists', async () => {
    contactDAO.checkEmail.mockResolvedValue(true);

    await expect(useCase.execute({ email: 'exists@mail.com', password: '12345678' }))
      .rejects.toThrow(EmailAlreadyInUseError);
  });

  it('should throw error if password is too short', async () => {
    contactDAO.checkEmail.mockResolvedValue(false);

    await expect(useCase.execute({ email: 'new@mail.com', password: 'short' }))
      .rejects.toThrow(InvalidPasswordError);
  });

  it('should rollback if email sending fails', async () => {
    const mockEmail = 'fail@example.com';
    const mockPassword = 'securepass';
    const mockUser = new Contact({ email: mockEmail });
    mockUser.id = 2;
    mockUser.publicData = { id: 2, email: mockEmail };

    contactDAO.checkEmail.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('hashed_pw');
    contactDAO.insert.mockResolvedValue(mockUser);
    sendEmail.mockRejectedValue(new Error('SMTP error'));

    await expect(useCase.execute({ email: mockEmail, password: mockPassword }))
      .rejects.toThrow(InvalidEmailSendingError);

    expect(contactDAO.deleteContact).toHaveBeenCalledWith(2, false);
  });
});