const InsertNote = require('../../business/deliveryNote/useCases/insertNote');
const { DeliveryNote } = require('../../business/deliveryNote/domain/deliveryNote');
const { DeliveryNoteEntries } = require('../../business/deliveryNote/domain/deliveryNoteEntries');
const { InvalidNoteFormatError } = require('../../business/error');

describe('InsertNote UseCase', () => {
  let mockDAO;
  let useCase;

  beforeEach(() => {
    mockDAO = {
      insertNote: jest.fn(),
      insertEntry: jest.fn()
    };

    useCase = new InsertNote(mockDAO);
  });

  it('inserisce una delivery note e le relative entries', async () => {
    const payload = { id: 1 };
    const data = {
      clientId: 2,
      projectId: 3,
      entries: [
        {
          type: 'hours',
          person: 'John Doe',
          hours: 8,
          description: 'Worked on feature X',
          workdate: '2024-05-01'
        },
        {
          type: 'material',
          material: 'Cemento',
          quantity: 10,
          description: 'Utilizzato per fondamenta',
          workdate: '2024-05-01'
        }
      ]
    };

    const mockNote = new DeliveryNote({ userId: 1, clientId: 2, projectId: 3 });
    mockNote.id = 42;
    mockDAO.insertNote.mockResolvedValue(mockNote);

    mockDAO.insertEntry.mockImplementation(async entry => {
      entry.id = Math.floor(Math.random() * 1000);
      return entry;
    });

    const result = await useCase.execute({ payload, data });

    expect(mockDAO.insertNote).toHaveBeenCalled();
    expect(mockDAO.insertEntry).toHaveBeenCalledTimes(2);
    expect(result.Note).toHaveProperty('id', 42);
    expect(result.Entries.length).toBe(2);
    expect(result.message).toBe('Note created successfully');
  });

  it('lancia errore se entries non è un array', async () => {
    const payload = { id: 1 };
    const data = { clientId: 2, projectId: 3, entries: "non-array" };

    await expect(useCase.execute({ payload, data })).rejects.toThrow(InvalidNoteFormatError);
    expect(mockDAO.insertNote).not.toHaveBeenCalled();
  });
});