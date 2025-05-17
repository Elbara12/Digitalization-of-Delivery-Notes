const NewPassword = require('../../business/contact/useCases/newPassword');
const { InvalidPasswordError, InvalidRecoveryCodeError } = require('../../business/error');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');

describe('NewPassword Use Case', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      newPassword: jest.fn(),
    };
    useCase = new NewPassword(contactDAO);
  });

  it('should change password if valid code and password', async () => {
    const user = {
      email: 'user@example.com',
      password: 'securepass',
      recoveryCode: '123456',
    };

    bcrypt.hash.mockResolvedValue('hashed_pw');
    contactDAO.newPassword.mockResolvedValue(true);

    const result = await useCase.execute({ user });

    expect(bcrypt.hash).toHaveBeenCalledWith('securepass', 10);
    expect(contactDAO.newPassword).toHaveBeenCalledWith('user@example.com', '123456', 'hashed_pw');
    expect(result).toEqual({ message: 'Password changed' });
  });

  it('should throw InvalidPasswordError for short password', async () => {
    const user = {
      email: 'user@example.com',
      password: 'short',
      recoveryCode: '123456',
    };

    await expect(useCase.execute({ user })).rejects.toThrow(InvalidPasswordError);
  });

  it('should throw InvalidRecoveryCodeError for invalid code', async () => {
    const user = {
      email: 'user@example.com',
      password: 'securepass',
      recoveryCode: '000000',
    };

    bcrypt.hash.mockResolvedValue('hashed_pw');
    contactDAO.newPassword.mockResolvedValue(false);

    await expect(useCase.execute({ user })).rejects.toThrow(InvalidRecoveryCodeError);
  });
});