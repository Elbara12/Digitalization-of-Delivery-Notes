const { Client } = require("../../business/client/domain/client");
const { InvalidCredentialsError } = require("../../business/error");

describe("Client Entity", () => {
  it("crea un client valido", () => {
    const client = new Client({
      name: "Test Company",
      CIF: "CIF12345",
      address: { street: "Via Roma", number: 10 },
      user_id: 1
    });

    expect(client.publicData.name).toBe("Test Company");
    expect(client.publicData.CIF).toBe("CIF12345");
    expect(client.publicData.user_id).toBe(1);
  });

  it("lancia errore se name è mancante", () => {
    expect(() => {
      new Client({
        CIF: "CIF12345",
        address: { street: "Via Roma" },
        user_id: 1
      });
    }).toThrow(InvalidCredentialsError);
  });

  it("lancia errore se CIF è mancante", () => {
    expect(() => {
      new Client({
        name: "Test",
        address: { street: "Via Roma" },
        user_id: 1
      });
    }).toThrow(InvalidCredentialsError);
  });

  it("lancia errore se address non è oggetto", () => {
    expect(() => {
      new Client({
        name: "Test",
        CIF: "123",
        address: null,
        user_id: 1
      });
    }).toThrow(InvalidCredentialsError);
  });

  it("lancia errore se user_id non è valido", () => {
    expect(() => {
      new Client({
        name: "Test",
        CIF: "123",
        address: { street: "Via" },
        user_id: "abc"
      });
    }).toThrow(InvalidCredentialsError);
  });
  it("usa i getter e setter correttamente", () => {
  const client = new Client({
    name: "Initial",
    CIF: "INIT123",
    address: { street: "Test" },
    user_id: 1,
  });

  client.id = 42;
  client.name = "Updated";
  client.CIF = "NEWCIF";
  client.address = { street: "Updated St" };
  client.user_id = 10;
  client.archived = true;

  expect(client.id).toBe(42);
  expect(client.name).toBe("Updated");
  expect(client.CIF).toBe("NEWCIF");
  expect(client.address.street).toBe("Updated St");
  expect(client.user_id).toBe(10);
  expect(client.archived).toBe(true);
});
});