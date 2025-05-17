const { DeliveryNote } = require('../../business/deliveryNote/domain/deliveryNote');
const { InvalidCredentialsError } = require('../../business/error');

describe('DeliveryNote class', () => {
  let note;

  beforeEach(() => {
    note = new DeliveryNote({
      userId: 1,
      clientId: 2,
      projectId: 3
    });
  });

  it('should set and get id', () => {
    note.id = 123;
    expect(note.id).toBe(123);
  });

  it('should set and get userId', () => {
    note.userId = 5;
    expect(note.userId).toBe(5);
  });

  it('should set and get clientId', () => {
    note.clientId = 6;
    expect(note.clientId).toBe(6);
  });

  it('should set and get projectId', () => {
    note.projectId = 7;
    expect(note.projectId).toBe(7);
  });

  it('should set and get signed', () => {
    note.signed = true;
    expect(note.signed).toBe(true);
  });

  it('should set and get signatureUrl', () => {
    note.signatureUrl = 'https://example.com/signature.png';
    expect(note.signatureUrl).toBe('https://example.com/signature.png');
  });

  it('should set and get pdfUrl', () => {
    note.pdfUrl = 'https://example.com/note.pdf';
    expect(note.pdfUrl).toBe('https://example.com/note.pdf');
  });

  it('should throw error on invalid userId', () => {
    expect(() => {
      new DeliveryNote({ userId: 0, clientId: 1, projectId: 1 });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error on invalid clientId', () => {
    expect(() => {
      new DeliveryNote({ userId: 1, clientId: -1, projectId: 1 });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error on invalid projectId', () => {
    expect(() => {
      new DeliveryNote({ userId: 1, clientId: 1, projectId: 'abc' });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error if projectId is missing (undefined)', () => {
    expect(() => {
      new DeliveryNote({ userId: 1, clientId: 1 });
    }).toThrow(InvalidCredentialsError);
  });
});