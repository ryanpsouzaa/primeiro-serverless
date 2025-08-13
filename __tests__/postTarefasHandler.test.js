const Tarefa = require("../src/schemas/Tarefa.js");
const postTarefas = require("../src/handlers/handler.js");

jest.unstable_mockModule("../config/dbConnect.js", () => ({
  conectarBancoDados: jest.fn().mockResolvedValue()
}));

beforeEach(()=>{
  jest.resetAllMocks();
})

const spyCreate = jest.spyOn(Tarefa, "create");

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
    //jest.spyOn(DB, "conectarBancoDados").mockResolvedValueOnce({});

    spyCreate.mockRejectedValue(new Error("ERRO - Mock"));

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

   spyCreate.mockResolvedValue({
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