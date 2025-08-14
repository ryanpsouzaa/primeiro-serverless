const Tarefa = require("../schemas/Tarefa.js");
const {conectarBancoDados} = require("../../config/dbConnect.js");
const {validadorDadosPost, validadorDadosPut} = require("../validacao/validadorTarefa.js");

const TarefaError = require("../exceptions/TarefaError.js");
const TarefaNaoEncontrada = require("../exceptions/TarefaNaoEncontradaError.js");
const TarefaJaFeitaError = require("../exceptions/TarefaJaFeitaError.js");
const ValidacaoError = require("../exceptions/ValidacaoError.js");

function tratarErro(erro) {
  if(
    erro instanceof TarefaNaoEncontrada ||
    erro instanceof ValidacaoError ||
    erro instanceof TarefaJaFeitaError
  ){
    throw erro;
  }
  throw new TarefaError(); // Erro genérico
}

function extrairMensagensErroValidacao(ajvErrors){
  return ajvErrors.map((erro) => {
    if (erro.keyword === "required") {
      return `O campo ${erro.params.missingProperty} é obrigatório`;
    }
    return erro.message;
  });
}

async function listarTarefas(){
  try{
    await conectarBancoDados();

    const tarefas = await Tarefa.find({});

    if(tarefas.length === 0){
      throw new TarefaNaoEncontrada("Não há tarefas cadastradas");
    }
    return tarefas;

  }catch(erro){
    tratarErro(erro);
  }
}

async function consultarTarefa(id){

  try{
    await conectarBancoDados();
    const tarefaEncontrada = await Tarefa.findById(id);

    if(!tarefaEncontrada){
      throw new TarefaNaoEncontrada();
    }

    return tarefaEncontrada;

  }catch (erro){
    tratarErro(erro);
  }
}

async function realizarTarefa(id){
  
  try{
    await conectarBancoDados();
    const tarefaEncontrada = await Tarefa.findById(id);

    if(!tarefaEncontrada){
      throw new TarefaNaoEncontrada();
    }

    if(tarefaEncontrada.feito){
      throw new TarefaJaFeitaError();
    }

    tarefaEncontrada.feito = true;
    await tarefaEncontrada.save();

    return tarefaEncontrada

  }catch (erro){
    tratarErro(erro);
  }
}

async function criarTarefa(dados){
  try{
    const validacao = validadorDadosPost(dados);
    if(validacao){
      console.log(validacao);
      await conectarBancoDados();

      const tarefaCriada = await Tarefa.create(dados);
      return tarefaCriada;
      
    }else{
      console.log(validadorDadosPost.errors);
      throw new ValidacaoError(extrairMensagensErroValidacao(validadorDadosPost.errors));
    }

  }catch(erro){
    tratarErro(erro);
  }
}

async function atualizarTarefa(id, dados){
  try{
    await conectarBancoDados();
    const validacao = validadorDadosPut(dados);

    if(validacao){
      const tarefaAlterada = await Tarefa.findByIdAndUpdate(id, dados);

      if(!tarefaAlterada){
        throw new TarefaNaoEncontrada();
      }
      
      return tarefaAlterada;

    }else{
      console.log(validadorDadosPut.errors);
      throw new ValidacaoError(extrairMensagensErroValidacao(validadorDadosPut.errors));
    }

  }catch(erro){
    throw new TarefaError();
  }
}

async function excluirTarefa(id){
  try{
    await conectarBancoDados();
    const exclusaoResultado = await Tarefa.findByIdAndDelete(id);
    if(!exclusaoResultado){
      throw new TarefaNaoEncontrada();
    }
    return exclusaoResultado;

  }catch(erro){
    throw new TarefaError();
  }
}

module.exports = {
  listarTarefas,
  consultarTarefa,
  criarTarefa,
  atualizarTarefa,
  realizarTarefa,
  excluirTarefa
}
