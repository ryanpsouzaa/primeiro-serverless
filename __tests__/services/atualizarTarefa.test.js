const { atualizarTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");
const TarefaError = require("../../src/exceptions/TarefaError.js");
const TarefaNaoEncontrada = require("../../src/exceptions/TarefaNaoEncontradaError.js");

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyUpdate = jest.spyOn(Tarefa, "findByIdAndUpdate");

describe("Testes no atualizarTarefa (PUT)", () => {
  it("Deveria retornar 400 por dados incorretos", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {nome: "TESTE"};

    //ACT
    const response = await atualizarTarefa(eventId, eventDados);

    //ASSERT
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatch(/O campo descricao é obrigatório/);
  });

  it("Deveria lancar TarefaNaoEncontrada por consultar Tarefa inexistente", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {descricao: "Descricao TESTE"};

    spyUpdate.mockResolvedValue(null);

    //ACT + ASSERT
    await expect(atualizarTarefa(eventId, eventDados)).reject.toThrow("Tarefa não encontrada")
  });

  it("Deveria retornar 500 por erro interno", async () => {
    //ARRANGE
    const eventId = {id: 1000};
    const eventDados = {descricao: "Descricao TESTE"};

    spyUpdate.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT
    const response = await atualizarTarefa(eventId, eventDados);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 por alterar Tarefa com sucesso", async () => {
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
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/Tarefa alterada com sucesso/);
  });
});