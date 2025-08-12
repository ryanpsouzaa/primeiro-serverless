import { tarefaRealizada } from "../handler.js";
import Tarefa from "../schemas/Tarefa.js";

beforeEach(() =>{
  jest.resetAllMocks();
})

jest.mock("../schemas/Tarefa.js", () => ({
  findById: jest.fn(),
  save: jest.fn()
}));

jest.mock("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

describe("Teste de tarefaRealizada", ()=>{
  it("Deveria retornar 404 ao consultar Tarefa inexistente", async() =>{
    //ARRANGE
    const spyFind = jest.spyOn(Tarefa, "findById")
    const event = {pathParameters: {id: 1000}};
    Tarefa.findById.mockResolvedValue(null);

    //ACT
    const response = await tarefaRealizada(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async() =>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}};
    Tarefa.findById.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT
    const response = await tarefaRealizada(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 400 ao tentar realizar Tarefa já realizada", async() =>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}};
    Tarefa.findById.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: true
    });

    //ACT
    const response = await tarefaRealizada(event);

    //ASSERT
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatch(/Tarefa já está realizada/);
  });

  it("Deveria retornar 200 por concluir Tarefa", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}};
    Tarefa.findById.mockResolvedValue({
      nome: "TESTE",
      descricao: "Descricao TESTE",
      feito: false,
      save: jest.fn().mockResolvedValue(null)
    });

    //ACT
    const response = await tarefaRealizada(event);
    
    //ASSERT
    const body = JSON.parse(response.body);
    const tarefaAlterada = body.tarefa;

    expect(response.statusCode).toBe(200);
    expect(body.mensagem).toMatch(/Tarefa realizada!/);

    expect(tarefaAlterada.feito).toBeTruthy();
    expect(tarefaAlterada.nome).toBe("TESTE");
    expect(tarefaAlterada.descricao).toBe("Descricao TESTE");
  });
})

