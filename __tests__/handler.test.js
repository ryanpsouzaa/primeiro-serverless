const { getTarefas } = require("../handler.js");

jest.mock("../schemas/Tarefa.js", () => ({
  find: jest.fn()
}));

jest.mock('../config/dbConnect', () => ({
  conectarBancoDados: jest.fn().mockResolvedValue(),
}));

const tarefa = require("../schemas/Tarefa.js");

describe("Teste getTarefas", () =>{
  it("Deveria retornar todas as tarefas criadas", async () =>{
    //ARRANGE
    tarefa.find.mockResolvedValue([
      {nome:"TesteUm", descricao:"DescricaoUm", feito:false},
      {nome:"TesteDois", descricao:"DescricaoDois", feito:true}
    ]);

    const event = {};

    //ACT
    const response = await getTarefas(event);
    
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

  it("Deveria retornar lista vazia", async () =>{

    //ARRANGE
    tarefa.find.mockResolvedValue([]);
    const event = {};

    //ACT
    const response = await getTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(400);

  });
});