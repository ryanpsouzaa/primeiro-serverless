const {listarTarefas} = require("../../src/services/tarefaService.js");
const Tarefa = require("../../src/schemas/Tarefa.js");

jest.mock("../../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const spyFind = jest.spyOn(Tarefa, "find");

describe("Testes em listarTarefas (GET)", () => {

  it("Deveria retornar todas as tarefas criadas", async () => {
    //ARRANGE
    spyFind.mockResolvedValue([
      { nome: "TesteUm", descricao: "DescricaoUm", feito: false },
      { nome: "TesteDois", descricao: "DescricaoDois", feito: true }
    ]);

    const event = {};

    //ACT
    const response = await listarTarefas(event);

    //ASSERT
    const body = JSON.parse(response.body);
    const tarefaUm = body[0];
    const tarefaDois = body[1];

    expect(response.statusCode).toBe(200);

    expect(tarefaUm.nome).toBe("TesteUm");
    expect(tarefaDois.nome).toBe("TesteDois");

    expect(tarefaUm.feito).toBeFalsy();
    expect(tarefaDois.feito).toBeTruthy();
  });

  it("Deveria retornar lista vazia", async () => {
    //ARRANGE
    spyFind.mockResolvedValue([]);

    const event = {};

    //ACT
    const response = await listarTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(400);
  });

  it("Deveria retornar 500 por erro interno", async ()=>{
    //ARRANGE
    const event ={};

    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT
    const response = await listarTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  })
})