const PasswordRecovery = require('../../business/contact/useCases/passwordRecovery');
const { InvalidEmailSendingError } = require('../../business/error');
const { sendEmail } = require('../../infrastructure/web/services/emailService');

jest.mock('../../infrastructure/web/services/emailService');

describe('PasswordRecovery Use Case', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      passwordRecovery: jest.fn()
    };
    useCase = new PasswordRecovery(contactDAO);
  });

  it('should store recovery code and send email', async () => {
    sendEmail.mockResolvedValue();
    const mail = 'test@example.com';

    const result = await useCase.execute({ mail });

    expect(contactDAO.passwordRecovery).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: mail }));
    expect(result).toEqual({ message: "Check your email for the recovery code" });
  });

  it('should throw error if email sending fails', async () => {
    sendEmail.mockRejectedValue(new Error('Send failed'));

    await expect(useCase.execute({ mail: 'fail@example.com' })).rejects.toThrow(InvalidEmailSendingError);
  });
});