const { excluirTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

beforeEach(()=>{
  jest.resetAllMocks()
});

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyDelete = jest.spyOn(Tarefa, "findByIdAndDelete");

describe("Testes em excluirTarefa (DELETE)", () => {
  it("Deveria retornar TarefaNaoEncontradaError por Tarefa inexistente", async () => {
    //ARRANGE
    const event = {id: 1000};

    spyDelete.mockResolvedValue(null);

    //ACT + ASSERT
    await expect(excluirTarefa(event)).rejects
      .toThrow("Tarefa não encontrada");

    expect(spyDelete).toHaveBeenCalledWith(event);
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });

  it("Deveria retornar TarefaError por erro interno", async () => {
    //ARRANGE
    const event = {id: 1000};

    spyDelete.mockRejectedValue(new Error("ERROR - Mock"));

    //ACT + ASSERT
    await expect(excluirTarefa(event)).rejects
      .toThrow("Erro interno no servidor");

    expect(spyDelete).toHaveBeenCalledWith(event);
  });

  it("Deveria retornar tarefaExcluida ao deletar Tarefa com sucesso", async () => {
    //ARRANGE
    const event = {id: 1000}

    spyDelete.mockResolvedValue({ nome: "TESTE" });

    //ACT
    const response = await excluirTarefa(event);

    //ASSERT
    expect(spyDelete).toHaveBeenCalledWith(event);
    expect(spyDelete).toHaveBeenCalledTimes(1);
    
    expect(response.nome).toBe("TESTE");
  });
});