const DeleteContact = require('../../business/contact/useCases/deleteContact');

describe('DeleteContact Use Case', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      deleteContact: jest.fn(),
    };
    useCase = new DeleteContact(contactDAO);
  });

  it('dovrebbe eseguire una soft delete', async () => {
    const result = await useCase.execute({ id: 1, soft: true });

    expect(contactDAO.deleteContact).toHaveBeenCalledWith(1, true);
    expect(result).toEqual({ Message: 'Contact soft deleted' });
  });

  it('dovrebbe eseguire una hard delete', async () => {
    const result = await useCase.execute({ id: 2, soft: false });

    expect(contactDAO.deleteContact).toHaveBeenCalledWith(2, false);
    expect(result).toEqual({ Message: 'Contact deleted' });
  });

  it('dovrebbe usare soft=true di default se non fornito', async () => {
    const result = await useCase.execute({ id: 3 });

    expect(contactDAO.deleteContact).toHaveBeenCalledWith(3, true);
    expect(result).toEqual({ Message: 'Contact soft deleted' });
  });
});