const { Contact } = require('../../business/contact/domain/contact');
const { InvalidEmailError, InvalidNameError } = require('../../business/error');

describe('Contact domain model', () => {
  let contact;

  beforeEach(() => {
    contact = new Contact({
      email: 'test@example.com',
      email_code: '123456',
      password_hash: 'hashedpw',
    });
  });

  it('should set and get basic fields', () => {
    contact.id = 1;
    contact.attempts = 3;
    contact.emailstatus = 1;
    contact.role = 'admin';
    contact.status = 'active';
    contact.url = 'https://example.com';
    contact.password_hash = 'newhash';

    expect(contact.id).toBe(1);
    expect(contact.attempts).toBe(3);
    expect(contact.emailstatus).toBe(1);
    expect(contact.role).toBe('admin');
    expect(contact.status).toBe('active');
    expect(contact.url).toBe('https://example.com');
    expect(contact.password_hash).toBe('newhash');
  });

  it('should accept valid email and throw on invalid ones', () => {
    contact.email = 'valid@email.com';
    expect(contact.email).toBe('valid@email.com');

    expect(() => {
      contact.email = 'invalidemail';
    }).toThrow(InvalidEmailError);
  });

  it('should return email_code', () => {
    expect(contact.email_code).toBe('123456');
  });

  it('should default password_hash to null if not provided', () => {
    const c = new Contact({
      email: 'default@pw.com',
      email_code: '789101',
    });
    expect(c.password_hash).toBe(null);
  });

  it('should set name only if valid or null, else throw error', () => {
    contact.name = 'Matteo';
    expect(contact.name).toBe('Matteo');

    contact.name = null;
    expect(contact.name).toBe(null);

    expect(() => {
      contact.name = 'ab';
    }).toThrow(InvalidNameError);
  });

  it('should set and get all other optional fields', () => {
    contact.NIF = '12345678A';
    contact.surname = 'Baraggini';
    contact.CIF = 'B12345678';
    contact.address = { street: 'Main St', city: 'Rome' };

    expect(contact.NIF).toBe('12345678A');
    expect(contact.surname).toBe('Baraggini');
    expect(contact.CIF).toBe('B12345678');
    expect(contact.address).toEqual({ street: 'Main St', city: 'Rome' });
  });

  it('should return correct publicData', () => {
    contact.id = 1;
    contact.attempts = 2;
    contact.emailstatus = 1;
    contact.role = 'user';
    contact.status = 'active';

    expect(contact.publicData).toEqual({
      id: 1,
      email: 'test@example.com',
      attempts: 2,
      emailstatus: 1,
      role: 'user',
      status: 'active',
    });
  });

  it('should return correct publicDataUser', () => {
    contact.id = 2;
    contact.name = 'Mario';
    contact.surname = 'Rossi';
    contact.NIF = 'XYZ98765';
    contact.role = 'personal_user';
    contact.status = 'active';
    contact.url = 'https://cdn/logo.png';

    expect(contact.publicDataUser).toEqual({
      id: 2,
      email: 'test@example.com',
      name: 'Mario',
      surname: 'Rossi',
      NIF: 'XYZ98765',
      attempts: 5,
      emailstatus: 0,
      role: 'personal_user',
      status: 'active',
      url: 'https://cdn/logo.png',
    });
  });

  it('should return correct publicDataCompany', () => {
    contact.id = 3;
    contact.name = 'Company Srl';
    contact.CIF = 'CIF123';
    contact.address = { street: 'Via Roma', city: 'Milano' };
    contact.role = 'company';
    contact.status = 'active';
    contact.url = 'https://cdn/logo.png';

    expect(contact.publicDataCompany).toEqual({
      id: 3,
      email: 'test@example.com',
      name: 'Company Srl',
      CIF: 'CIF123',
      address: { street: 'Via Roma', city: 'Milano' },
      attempts: 5,
      emailstatus: 0,
      role: 'company',
      status: 'active',
      url: 'https://cdn/logo.png',
    });
  });
});