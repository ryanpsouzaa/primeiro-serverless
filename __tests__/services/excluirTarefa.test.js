const { excluirTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyDelete = jest.spyOn(Tarefa, "findByIdAndDelete");

describe("Testes em excluirTarefa (DELETE)", () => {
  it("Deveria retornar 404 por Tarefa inexistente", async () => {
    //ARRANGE
    const event = {id: 1000};

    spyDelete.mockResolvedValue(null);

    //ACT
    const response = await excluirTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async () => {
    //ARRANGE
    const event = {id: 1000};

    spyDelete.mockRejectedValue(new Error("ERROR - Mock"));
    //ACT
    const response = await excluirTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 ao deletar Tarefa com sucesso", async () => {
    //ARRANGE
    const event = {id: 1000}

    spyDelete.mockResolvedValue({ nome: "TESTE" });

    //ACT
    const response = await excluirTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/Tarefa excluída com sucesso/);
  });
});