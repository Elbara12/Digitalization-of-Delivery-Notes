const InsertClient = require("../../business/client/useCases/insertClient");
const { Client } = require("../../business/client/domain/client");
const { CifAlreadyInUseError } = require("../../business/error");

describe("InsertClient", () => {
  let clientDAO;
  let useCase;

  beforeEach(() => {
    clientDAO = {
      insert: jest.fn(async (client) => {
        client.id = 1;
        return client;
      }),
      checkCif: jest.fn(async () => false) // default: CIF non esiste
    };

    useCase = new InsertClient(clientDAO);
  });

  it("inserisce un nuovo client e restituisce i dati pubblici", async () => {
    const mockInput = {
      payload: { id: 1 },
      client: {
        name: "Test Company",
        cif: "ABC123456",
        address: {
          street: "Main St",
          number: 1,
          city: "Testville",
          postal: "00000",
          province: "TS"
        }
      }
    };

    const result = await useCase.execute(mockInput);

    expect(clientDAO.insert).toHaveBeenCalled(); // verifica che sia stato chiamato
    expect(result).toHaveProperty("client");
    expect(result.client).toHaveProperty("id", 1);
    expect(result.message).toBe("Client created successfully");
  });

  it("lancia un errore se il CIF è già in uso per quell'utente", async () => {
    clientDAO.checkCif = jest.fn(async () => true); // Simula CIF duplicato

    const mockInput = {
      payload: { id: 1 },
      client: {
        name: "Test Company",
        cif: "ABC123456",
        address: {
          street: "Main St",
          number: 1,
          city: "Testville",
          postal: "00000",
          province: "TS"
        }
      }
    };

    await expect(useCase.execute(mockInput)).rejects.toThrow(CifAlreadyInUseError);
    expect(clientDAO.insert).not.toHaveBeenCalled();
  });
});