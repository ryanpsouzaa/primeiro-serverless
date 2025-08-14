const { realizarTarefa } = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyFind = jest.spyOn(Tarefa, "findById");

describe("Testes em realizarTarefa (GET)", () => {
  it("Deveria retornar 404 ao consultar Tarefa inexistente", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockResolvedValue(null);

    //ACT
    const response = await realizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT
    const response = await realizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 400 ao tentar realizar Tarefa já realizada", async () => {
    //ARRANGE
    const event = { id: 1000 };
    spyFind.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: true
    });

    //ACT
    const response = await realizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatch(/Tarefa já está feita/);
  });

  it("Deveria retornar 200 por concluir Tarefa", async () => {
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
    const body = JSON.parse(response.body);
    const tarefaAlterada = body.tarefa;

    expect(response.statusCode).toBe(200);
    expect(body.mensagem).toMatch(/Tarefa Realizada!/);

    expect(tarefaAlterada.feito).toBeTruthy();
    expect(tarefaAlterada.nome).toBe("TESTE");
    expect(tarefaAlterada.descricao).toBe("Descricao TESTE");
  });
})