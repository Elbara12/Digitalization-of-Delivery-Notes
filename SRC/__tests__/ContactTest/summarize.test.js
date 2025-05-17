const Summarize = require('../../business/contact/useCases/summarize');

describe('Summarize Use Case', () => {
  let contactDAO;
  let useCase;

  beforeEach(() => {
    contactDAO = {
      summarize: jest.fn().mockResolvedValue({ total: 5, active: 3 })
    };
    useCase = new Summarize(contactDAO);
  });

  it('should return the summarized contact data', async () => {
    const result = await useCase.execute();

    expect(contactDAO.summarize).toHaveBeenCalled();
    expect(result).toEqual({ total: 5, active: 3 });
  });
});