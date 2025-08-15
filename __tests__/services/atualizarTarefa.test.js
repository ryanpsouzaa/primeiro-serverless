const { atualizarTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");
const TarefaError = require("../../src/exceptions/TarefaError.js");
const TarefaNaoEncontrada = require("../../src/exceptions/TarefaNaoEncontradaError.js");

beforeEach(()=>{
  jest.resetAllMocks();
})

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyUpdate = jest.spyOn(Tarefa, "findByIdAndUpdate");

describe("Testes no atualizarTarefa (PUT)", () => {
  it("Deveria lancar ValidacaoError por dados incorretos", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {nome: "TESTE"};

    //ACT + ASSERT
    await expect(atualizarTarefa(eventId, eventDados)).rejects
      .toThrow("O campo descricao é obrigatório");

    expect(spyUpdate).not.toHaveBeenCalledWith();
  });

  it("Deveria lancar TarefaNaoEncontrada por consultar Tarefa inexistente", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {descricao: "Descricao TESTE"};

    spyUpdate.mockResolvedValue(null);

    //ACT + ASSERT
    await expect(atualizarTarefa(eventId, eventDados)).rejects
      .toThrow("Tarefa não encontrada");

    expect(spyUpdate).toHaveBeenCalledWith(eventId, eventDados);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
  });

  it("Deveria retornar TarefaError por erro interno", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {descricao: "Descricao TESTE"};

    spyUpdate.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT + ASSERT
    await expect(atualizarTarefa(eventId, eventDados)).rejects
      .toThrow("Erro interno no servidor");

    expect(spyUpdate).toHaveBeenCalledWith(eventId, eventDados);
  });

  it("Deveria retornar TarefaAlterada por alterar Tarefa com sucesso", async () => {
    //ARRANGE
    const descricaoAlterada = "Descricao Alterada";
    const eventId = {id: 1000};
    const eventDados = {descricao: descricaoAlterada};

    spyUpdate.mockResolvedValue({
      id: 1000,
      nome: "TESTE",
      descricao: descricaoAlterada,
      feito: false
    });

    //ACT
    const response = await atualizarTarefa(eventId, eventDados);

    //ASSERT
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledWith(eventId, eventDados);

    expect(response.nome).toBe("TESTE");
    expect(response.descricao).toBe(eventDados.descricao);
    expect(response.feito).toBeFalsy();
  });
});