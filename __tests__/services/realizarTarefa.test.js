const { realizarTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

beforeEach(() =>{
  jest.resetAllMocks()
});

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyFind = jest.spyOn(Tarefa, "findById");

describe("Testes em realizarTarefa (GET)", () => {
  it("Deveria retornar TarefaNaoEncontrada ao consultar Tarefa inexistente", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockResolvedValue(null);

    //ACT + ASSERT
    await expect(realizarTarefa(event)).rejects
      .toThrow("Tarefa não encontrada");

    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);
  });

  it("Deveria retornar TarefaError por erro interno", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT + ASSERT
    await expect(realizarTarefa(event)).rejects
      .toThrow("Erro interno no servidor");

    expect(spyFind).toHaveBeenCalledWith(event);
  });

  it("Deveria retornar TarefaJaFeitaError ao tentar realizar Tarefa já realizada", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: true
    });

    //ACT + ASSERT
    await expect(realizarTarefa(event)).rejects
      .toThrow("Tarefa já está feita");

    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);
  });

  it("Deveria retornar tarefaRealizada por concluir Tarefa", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false,
      save: jest.fn().mockResolvedValue(null)
    });

    //ACT
    const response = await realizarTarefa(event);

    //ASSERT
    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);

    expect(response.feito).toBeTruthy();
    expect(response.nome).toBe("TESTE");
    expect(response.descricao).toBe("Descricao TESTE");
  });
});