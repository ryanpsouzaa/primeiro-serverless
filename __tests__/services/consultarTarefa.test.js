const { consultarTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

beforeEach(() =>{
  jest.resetAllMocks()
});

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyFind = jest.spyOn(Tarefa, "findById");

describe("Testes em consultarTarefa (GET)", () => {
  it("Deveria retornar TarefaNaoEncontradaError ao consultar Tarefa inexistente", async () => {
    //ARRANGE
    const event = {id: 1000};

    spyFind.mockResolvedValue(null);

    //ACT + ASSERT
    await expect(consultarTarefa(event)).rejects
      .toThrow("Tarefa não encontrada");

    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);
  });

  it("Deveria lancar TarefaError por erro interno", async () => {
    //ARRANGE
    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    const event = { id: 10000 };

    //ACT + ASSERT
    await expect(consultarTarefa(event)).rejects  
      .toThrow("Erro interno no servidor");

    expect(spyFind).toHaveBeenCalledWith(event);
    
  });

  it("Deveria retornar TarefaEncontrada ao consultar Tarefa existente", async () => {
    //ARRANGE
    spyFind.mockResolvedValue({ nome: "TarefaTeste", descricao: "Descricao TarefaTeste", feito: true });

    const event = { id: 100 };

    //ACT
    const response = await consultarTarefa(event);

    //ASSERT
    expect(spyFind).toHaveBeenCalledTimes(1);
    expect(spyFind).toHaveBeenCalledWith(event);

    expect(response.nome).toBe("TarefaTeste");
    expect(response.descricao).toBe("Descricao TarefaTeste");
    expect(response.feito).toBeTruthy();
  });
});