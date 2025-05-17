const { DeliveryNoteEntries } = require('../../business/deliveryNote/domain/deliveryNoteEntries');
const { InvalidCredentialsError } = require('../../business/error');

describe('DeliveryNoteEntries class', () => {
  let entry;

  beforeEach(() => {
    entry = new DeliveryNoteEntries({
      deliveryNoteId: 1,
      type: 'hours',
      person: 'John Doe',
      hours: 8,
      material: null,
      quantity: null,
      description: 'Worked on feature X',
      workdate: '2024-05-01'
    });
  });

  it('should create a valid entry and access properties', () => {
    expect(entry.deliveryNoteId).toBe(1);
    expect(entry.type).toBe('hours');
    expect(entry.person).toBe('John Doe');
    expect(entry.hours).toBe(8);
    expect(entry.material).toBe(null);
    expect(entry.quantity).toBe(null);
    expect(entry.description).toBe('Worked on feature X');
    expect(entry.workdate).toBe('2024-05-01');
  });

  it('should set and get all properties', () => {
    entry.id = 10;
    entry.deliveryNoteId = 2;
    entry.type = 'material';
    entry.person = 'Jane';
    entry.hours = 5;
    entry.material = 'Cement';
    entry.quantity = 2.5;
    entry.description = 'Used for foundation';
    entry.workdate = '2024-05-02';

    expect(entry.id).toBe(10);
    expect(entry.deliveryNoteId).toBe(2);
    expect(entry.type).toBe('material');
    expect(entry.person).toBe('Jane');
    expect(entry.hours).toBe(5);
    expect(entry.material).toBe('Cement');
    expect(entry.quantity).toBe(2.5);
    expect(entry.description).toBe('Used for foundation');
    expect(entry.workdate).toBe('2024-05-02');
  });

  it('should return correct publicData', () => {
    const data = entry.publicData;
    expect(data).toEqual({
      id: null,
      deliveryNoteId: 1,
      type: 'hours',
      person: 'John Doe',
      hours: 8,
      material: null,
      quantity: null,
      description: 'Worked on feature X',
      workdate: '2024-05-01'
    });
  });

  it('should throw error on invalid deliveryNoteId', () => {
    expect(() => {
      new DeliveryNoteEntries({
        deliveryNoteId: 0,
        type: 'hours',
        description: 'Test',
        workdate: '2024-05-01'
      });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error on invalid type', () => {
    expect(() => {
      new DeliveryNoteEntries({
        deliveryNoteId: 1,
        type: 'invalid',
        description: 'Test',
        workdate: '2024-05-01'
      });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error on missing or invalid description', () => {
    expect(() => {
      new DeliveryNoteEntries({
        deliveryNoteId: 1,
        type: 'hours',
        description: null,
        workdate: '2024-05-01'
      });
    }).toThrow(InvalidCredentialsError);
  });

  it('should throw error on invalid workdate', () => {
    expect(() => {
      new DeliveryNoteEntries({
        deliveryNoteId: 1,
        type: 'hours',
        description: 'Test',
        workdate: 'invalid-date'
      });
    }).toThrow(InvalidCredentialsError);
  });
});