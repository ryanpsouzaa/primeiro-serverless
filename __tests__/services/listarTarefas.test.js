const {listarTarefas} = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

beforeEach(()=>{
  jest.resetAllMocks()
});

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyFind = jest.spyOn(Tarefa, "find");

describe("Testes em listarTarefas (GET)", () => {

  it("Deveria retornar Tarefas cadastradas", async () => {
    //ARRANGE
    spyFind.mockResolvedValue([
      { nome: "TesteUm", descricao: "DescricaoUm", feito: false },
      { nome: "TesteDois", descricao: "DescricaoDois", feito: true }
    ]);

    const event = {};

    //ACT
    const response = await listarTarefas(event);

    //ASSERT
    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);

    const tarefaUm = response[0];
    const tarefaDois = response[1];

    expect(tarefaUm.nome).toBe("TesteUm");
    expect(tarefaDois.nome).toBe("TesteDois");

    expect(tarefaUm.feito).toBeFalsy();
    expect(tarefaDois.feito).toBeTruthy();
  });

  it("Deveria lancar TarefaNaoEncontrada por lista vazia", async () => {
    //ARRANGE
    spyFind.mockResolvedValue([]);

    const event = {};

    //ACT
    await expect(listarTarefas(event)).rejects
      .toThrow("Não há tarefas cadastradas");

    expect(spyFind).toHaveBeenCalledWith(event);
    expect(spyFind).toHaveBeenCalledTimes(1);
  });

  it("Deveria retornar TarefaError por erro interno", async ()=>{
    //ARRANGE
    const event ={};

    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT + ASSERT
    await expect(listarTarefas(event)).rejects
      .toThrow("Erro interno no servidor");

    expect(spyFind).toHaveBeenCalledWith(event);
  })
})