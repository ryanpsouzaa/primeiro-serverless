const Tarefa = require("../src/schemas/Tarefa.js");
describe("Testes no Schema Tarefa", ()=>{

  it("Deve lancar erro ao tentar validar dados incorretos (sem nome da tarefa)", async ()=>{
    //ARRANGE
    const mensagemErro = "Campo nome é obrigatório";
    const dados = {
      descricao: "Reuniao as 12:00",
      feito: false
    }
    let erro;
    const tarefa = new Tarefa(dados);

    //ACT
    try{
      await tarefa.validate();
    } catch (erroLancado){
      erro = erroLancado;
    }

    //ASSERT
    expect(erro).toBeDefined();
    expect(erro.errors.nome).toBeDefined();
    expect(erro.errors.nome.message).toBe(mensagemErro);
  });

  it("Atributo FEITO deve estar false por padrao", async ()=>{
    //ARRANGE
    const dados = {
      nome: "Teste",
      descricao: "Teste descricao"
    }

    //ACT
    const tarefa = new Tarefa(dados);

    //ASSERT
    expect(tarefa.feito).toBeFalsy();
    expect(tarefa).toBeDefined();

    expect(tarefa.nome).toBe(dados.nome);
    expect(tarefa.descricao).toBe(dados.descricao);
  });
});