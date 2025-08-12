import { postTarefas } from "../handler.js";
import Tarefa from "../schemas/Tarefa.js";

jest.mock("../schemas/Tarefa.js", () => ({
  create: jest.fn()
}));

jest.mock("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

describe("Teste postTarefas", ()=>{
  it("Deveria retornar 422 por body inexistente", async ()=>{
    //ARRANGE
    const event = {}

    //ACT
    const response = await postTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(422);
    expect(response.body).toMatch(/Corpo da requisição não enviado/);
  });

  it("Deveria retornar 500 por erro interno", async () =>{
    //ARRANGE
    Tarefa.create.mockImplementation(() =>{
      throw new Error("ERRO - Mock")
    });

    const event = {body: JSON.stringify({ nome: "Teste"})}

    //ACT
    const response = await postTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 201 ao criar Tarefa corretamente", async ()=>{
    //ARRANGE
    const event = {body: JSON.stringify({
      nome: "TESTE",
      descricao : "Descricao TESTE",
      feito: false
    })}

   Tarefa.create.mockResolvedValue({
      nome: "TESTE",
      descricao : "Descricao TESTE",
      feito: false}) 

    //ACT
    const response = await postTarefas(event);

    //ASSERT
    const bodyResponse = JSON.parse(response.body);
    expect(response.statusCode).toBe(201);
    expect(bodyResponse.mensagem).toMatch(/Tarefa cadastrada com sucesso/);

    expect(bodyResponse.tarefa.nome).toBe("TESTE");
    expect(bodyResponse.tarefa.descricao).toBe("Descricao TESTE");
    expect(bodyResponse.tarefa.feito).toBeFalsy();
  });
})