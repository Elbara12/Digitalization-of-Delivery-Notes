const { UserController } = require('../../infrastructure/web/controller/userController');
const InsertContact = require('../../business/contact/useCases/insertContact');
const ValidateMail = require('../../business/contact/useCases/validateMail');
const ValidateLogin = require('../../business/contact/useCases/validateLogin');
const OnBoardingCompany = require('../../business/contact/useCases/onBoardingCompany');
const OnBoardingUser = require('../../business/contact/useCases/onBoardingUser');
const UrlUpload = require('../../business/contact/useCases/urlUpload');
const DeleteContact = require('../../business/contact/useCases/deleteContact');
const GetUser = require('../../business/contact/useCases/getUser');
const PasswordRecovery = require('../../business/contact/useCases/passwordRecovery');
const NewPassword = require('../../business/contact/useCases/newPassword');
const Summarize = require('../../business/contact/useCases/summarize');

describe('UserController', () => {
  let controller;
  let contactDAO;

  beforeEach(() => {
    contactDAO = {};
    controller = new UserController(contactDAO);
  });

  it('should handle registration', async () => {
    InsertContact.prototype.execute = jest.fn().mockResolvedValue('registered');
    const result = await controller.registration({ body: {} });
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('registered');
  });

  it('should handle validation', async () => {
    ValidateMail.prototype.execute = jest.fn().mockResolvedValue('validated');
    const result = await controller.validation({ user: {}, body: { email_code: '123456' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('validated');
  });

  it('should handle login', async () => {
    ValidateLogin.prototype.execute = jest.fn().mockResolvedValue('loggedin');
    const result = await controller.login({ body: {} });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('loggedin');
  });

  it('should handle onboarding company', async () => {
    OnBoardingCompany.prototype.execute = jest.fn().mockResolvedValue('onboarded-company');
    const result = await controller.onBoardingCompany({ user: {}, body: {} });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('onboarded-company');
  });

  it('should handle onboarding user', async () => {
    OnBoardingUser.prototype.execute = jest.fn().mockResolvedValue('onboarded-user');
    const result = await controller.onBoardingUser({ user: {}, body: {} });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('onboarded-user');
  });

  it('should handle upload url', async () => {
    UrlUpload.prototype.execute = jest.fn().mockResolvedValue('uploaded');
    const result = await controller.urlUpload({ user: {}, file: { path: '/path/to/image.png' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('uploaded');
  });

  it('should handle getUser', async () => {
    GetUser.prototype.execute = jest.fn().mockResolvedValue('user');
    const result = await controller.getUser({ user: {} });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('user');
  });

  it('should handle delete', async () => {
    DeleteContact.prototype.execute = jest.fn().mockResolvedValue('deleted');
    const result = await controller.delete({ user: { id: 1 }, query: { soft: 'true' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('deleted');
  });

  it('should handle recovery', async () => {
    PasswordRecovery.prototype.execute = jest.fn().mockResolvedValue('recovered');
    const result = await controller.recovery({ body: { email: 'test@mail.com' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('recovered');
  });

  it('should handle new password', async () => {
    NewPassword.prototype.execute = jest.fn().mockResolvedValue('changed');
    const result = await controller.newPassword({ body: { email: 'test@mail.com', password: '12345678' } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('changed');
  });

  it('should handle summarize', async () => {
    Summarize.prototype.execute = jest.fn().mockResolvedValue('summary');
    const result = await controller.summarize({});
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('summary');
  });

  it('should handle registration error', async () => {
    InsertContact.prototype.execute = jest.fn().mockRejectedValue(new Error('fail'));
    const result = await controller.registration({ body: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('fail');
  });

  it('should handle error in validation', async () => {
  ValidateMail.prototype.execute = jest.fn().mockRejectedValue(new Error('fail validation'));
  const result = await controller.validation({ user: {}, body: { email_code: '123456' } });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail validation');
});

it('should handle error in login', async () => {
  ValidateLogin.prototype.execute = jest.fn().mockRejectedValue(new Error('fail login'));
  const result = await controller.login({ body: {} });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail login');
});

it('should handle error in onBoardingCompany', async () => {
  OnBoardingCompany.prototype.execute = jest.fn().mockRejectedValue(new Error('fail company'));
  const result = await controller.onBoardingCompany({ user: {}, body: {} });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail company');
});

it('should handle error in onBoardingUser', async () => {
  OnBoardingUser.prototype.execute = jest.fn().mockRejectedValue(new Error('fail user'));
  const result = await controller.onBoardingUser({ user: {}, body: {} });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail user');
});

it('should handle error in urlUpload', async () => {
  UrlUpload.prototype.execute = jest.fn().mockRejectedValue(new Error('fail upload'));
  const result = await controller.urlUpload({ user: {}, file: { path: '/dummy.png' } });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail upload');
});

it('should handle error in getUser', async () => {
  GetUser.prototype.execute = jest.fn().mockRejectedValue(new Error('fail get user'));
  const result = await controller.getUser({ user: {} });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail get user');
});

it('should handle error in delete', async () => {
  DeleteContact.prototype.execute = jest.fn().mockRejectedValue(new Error('fail delete'));
  const result = await controller.delete({ user: { id: 1 }, query: { soft: 'true' } });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail delete');
});

it('should handle error in recovery', async () => {
  PasswordRecovery.prototype.execute = jest.fn().mockRejectedValue(new Error('fail recovery'));
  const result = await controller.recovery({ body: { email: 'mail@test.com' } });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail recovery');
});

it('should handle error in newPassword', async () => {
  NewPassword.prototype.execute = jest.fn().mockRejectedValue(new Error('fail new pwd'));
  const result = await controller.newPassword({ body: { email: 'mail@test.com', password: '12345678' } });
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail new pwd');
});

it('should handle error in summarize', async () => {
  Summarize.prototype.execute = jest.fn().mockRejectedValue(new Error('fail summary'));
  const result = await controller.summarize({});
  expect(result.statusCode).toBe(400);
  expect(result.payload.error).toBe('fail summary');
});
});