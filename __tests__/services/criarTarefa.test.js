const { criarTarefa } = require("../../src/services/tarefaService");
const Tarefa = require("../../src/schemas/Tarefa.js");

beforeEach(() =>{
  jest.resetAllMocks();
});

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyCreate = jest.spyOn(Tarefa, "create");

describe("Testes em criarTarefa (POST)", () => {
  it("Deveria retornar 400 por dados incorretos", async () => {
    //ARRANGE
    const event = {nome: "TESTE"};

    //ACT
    const response = await criarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatch(/O campo descricao é obrigatório/);
  });

  it("Deveria retornar 500 por erro interno", async () => {
    //ARRANGE
    //jest.spyOn(DB, "conectarBancoDados").mockResolvedValueOnce({});
    spyCreate.mockRejectedValue(new Error("ERRO - Mock"));

    const event = {
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false    
    }
      
    //ACT
    const response = await criarTarefa(event);

    //ASSERT
    expect(spyCreate).toHaveReturned();
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 201 ao criar Tarefa corretamente", async () => {
    //ARRANGE
    const event = {
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false
    };

    spyCreate.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false
    });

    //ACT
    const response = await criarTarefa(event);

    //ASSERT
    const bodyResponse = JSON.parse(response.body);

    expect(spyCreate).toHaveReturned();
    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(spyCreate).toHaveBeenCalledWith(event);

    expect(response.statusCode).toBe(201);
    expect(bodyResponse.mensagem).toMatch(/Tarefa criada com sucesso/);

    expect(bodyResponse.tarefa.nome).toBe("TESTE");
    expect(bodyResponse.tarefa.descricao).toBe("Descricao TESTE");
    expect(bodyResponse.tarefa.feito).toBeFalsy();
  });
});