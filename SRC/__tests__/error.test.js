const errors = require('../business/error');

describe('User Error Classes', () => {
  for (const [name, ErrorClass] of Object.entries(errors)) {
    if (typeof ErrorClass !== 'function') continue;

    it(`${name} should be instance of UserError`, () => {
      const instance = new ErrorClass("Custom message");
      expect(instance).toBeInstanceOf(errors.UserError);
      expect(instance.name).toBe(name);

      // Skip statusCode check for base class
      if (name !== 'UserError') {
        expect(instance.statusCode).toBeDefined();
      }
    });

    it(`${name} should have a default message if none provided`, () => {
      const instance = new ErrorClass();
      if (name !== 'UserError') {
        expect(instance.message).toBeTruthy();
      }
    });
  }
});