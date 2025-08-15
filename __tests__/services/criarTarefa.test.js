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
  it("Deveria retornar ValidacaoError por dados incorretos", async () => {
    //ARRANGE
    const event = {nome: "TESTE"};

    //ACT + ASSERT
    await expect(criarTarefa(event)).rejects
      .toThrow("O campo descricao é obrigatório");

    expect(spyCreate).not.toHaveBeenCalled();
  });

  it("Deveria retornar TarefaError por erro interno", async () => {
    //ARRANGE
    spyCreate.mockRejectedValue(new Error("ERRO - Mock"));

    const event = {
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false    
    }
      
    //ACT + ASSERT
    await expect(criarTarefa(event)).rejects
      .toThrow("Erro interno no servidor");

    expect(spyCreate).toHaveBeenCalledWith(event);
  });

  it("Deveria retornar tarefaCriada ao criar Tarefa corretamente", async () => {
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

    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(spyCreate).toHaveBeenCalledWith(event);

    expect(response.nome).toBe("TESTE");
    expect(response.descricao).toBe("Descricao TESTE");
    expect(response.feito).toBeFalsy();
  });
});