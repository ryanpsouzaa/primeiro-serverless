import { deletarTarefa } from "../handler.js";

jest.mock("../schemas/Tarefa.js", ()=> ({
  findByIdAndDelete: jest.fn()
}));

jest.mock("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

const Tarefa = require("../schemas/Tarefa.js");

describe("Teste deletarTarefa", ()=>{
  it("Deveria retornar 404 por Tarefa inexistente", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}};

    Tarefa.findByIdAndDelete.mockResolvedValue(null);

    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatch(/Tarefa não encontrada/);
  });

  it("Deveria retornar 500 por erro interno", async ()=>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}}

    Tarefa.findByIdAndDelete.mockRejectedValue(new Error("ERRO - Mock"));
    
    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatch(/Erro interno no servidor/);
  });

  it("Deveria retornar 200 ao deletar Tarefa com sucesso", async () =>{
    //ARRANGE
    const event = {pathParameters: {id: 1000}}

    Tarefa.findByIdAndDelete.mockResolvedValue({nome: "TESTE"});

    //ACT
    const response = await deletarTarefa(event);

    //ASSERT
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/Tarefa excluída com sucesso/);
  });
});