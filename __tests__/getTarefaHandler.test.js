import { getTarefas } from "../handler.js";
import Tarefa from "../schemas/Tarefa.js";

beforeEach(()=>{
  jest.resetAllMocks();
});

jest.mock('../config/dbConnect', () => ({
  conectarBancoDados: jest.fn().mockResolvedValue(),
}));

describe("Teste getTarefas", () =>{
  it("Deveria retornar todas as tarefas criadas", async () =>{
    //ARRANGE
    const spyFind = jest.spyOn(Tarefa, "find").mockResolvedValue([
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
    const spyFind = jest.spyOn(Tarefa, "find").mockResolvedValue([]);

    const event = {};

    //ACT
    const response = await getTarefas(event);

    //ASSERT
    expect(response.statusCode).toBe(400);
  });
});