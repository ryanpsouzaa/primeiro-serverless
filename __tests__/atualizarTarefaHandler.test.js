import { jest } from "@jest/globals";

jest.mock("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

import Tarefa from "../src/schemas/Tarefa.js";
import { atualizarTarefa } from "../src/handlers/handler.js";

beforeEach(() =>{
  jest.resetAllMocks();
});

const spyFind = jest.spyOn(Tarefa, "findByIdAndUpdate");

describe("Teste em atualizarTarefa", ()=> {
  it("Deveria retornar 422 por requisição sem body", async ()=> {
    //ARRANGE
    const event = {}

    //ACT
    const response = await atualizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(422);
    expect(response.body).toMatch(/Corpo da requisição não enviado/);
  });

  it("Deveria retornar 404 por consultar Tarefa inexistente", async()=>{
    //ARRANGE
    const event = {
      body: JSON.stringify({descricao: "Descricao alterada"}),
      pathParameters: {id: 1000}
    };

    spyFind.mockResolvedValue(null);

    //ACT
    const response = await atualizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async ()=>{
    //ARRANGE
    const event = {
      body: JSON.stringify({descricao: "Descricao alterada"}),
      pathParameters: {id: 1000}
    };

    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    //ACT
    const response = await atualizarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 por alterar Tarefa com sucesso", async() =>{
    //ARRANGE
    const descricaoAlterada = "Descricao Alterada";
    const event = {
      body: JSON.stringify({descricao: descricaoAlterada}),
      pathParameters: {id: 1000}
    };

    spyFind.mockResolvedValue({
      id: 1000,
      nome: "TESTE",
      descricao: descricaoAlterada,
      feito: false
    });

    //ACT
    const response = await atualizarTarefa(event);
    
    //ASSERT
    const tarefaAlterada = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(tarefaAlterada.descricao).toBe(descricaoAlterada);
  });
});