import { jest } from "@jest/globals";

jest.mock("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

import Tarefa from "../src/schemas/Tarefa.js";
import { deletarTarefa } from "../src/handlers/handler.js";

beforeEach(()=>{
  jest.resetAllMocks();
});

const spyFind = jest.spyOn(Tarefa, "findByIdAndDelete");

describe("Teste deletarTarefa", ()=>{
  it("Deveria retornar 404 por Tarefa inexistente", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}};

    spyFind.mockResolvedValue(null);

    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}}

    spyFind.mockRejectValue(new Error("ERROR - Mock"));    
    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 ao deletar Tarefa com sucesso", async () =>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}}

    spyFind.mockResolvedValue({nome: "TESTE"});

    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/Tarefa excluída com sucesso/);
  });
});