import { jest } from "@jest/globals";

jest.mock('../config/dbConnect.js', () => ({
  conectarBancoDados: jest.fn().mockResolvedValue(),
}));

import Tarefa from "../src/schemas/Tarefa.js";
import { consultarTarefa } from "../src/handlers/handler.js";

beforeAll(() => {
  jest.resetAllMocks();
})

const spyFind = jest.spyOn(Tarefa, "findById");

describe("Teste no consultarTarefa", ()=>{
  it("Deveria retornar 404 ao consultar Tarefa inexistente", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 10000}};

    spyFind.mockResolvedValue(null);

    //ACT
    const response = await consultarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 400 ao dar falha para encontrar Tarefa", async ()=>{
    //ARRANGE
    spyFind.mockRejectedValue(new Error("ERRO - Mock"));

    const event = {pathParameters: {id: 10000}};

    //ACT
    const response = await consultarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 ao consultar Tarefa existente", async() =>{
    //ARRANGE
    spyFind.mockResolvedValue({nome: "TarefaTeste", descricao: "Descricao TarefaTeste", feito: true});

    const event = {pathParameters: {id: 100}}

    //ACT
    const response = await consultarTarefa(event);

    //ASSERT
    const tarefa = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);

    expect(tarefa.nome).toBe("TarefaTeste");
    expect(tarefa.descricao).toBe("Descricao TarefaTeste");
    expect(tarefa.feito).toBeTruthy();
  });
});