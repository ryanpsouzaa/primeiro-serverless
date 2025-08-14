const {Tarefa} = require("../schemas/Tarefa.js");
const {conectarBancoDados} = require("../../config/dbConnect.js");
const Ajv = require("ajv");

const postSchema = require("../validacao/postTarefa.json");
const putSchema = require("../validacao/putTarefa.json"); 

const ajv = new Ajv();
const validarDadosPost = ajv.compile(postSchema);
const validarDadosPut = ajv.compile(putSchema);

async function listarTarefas(){
  try{
    await conectarBancoDados();

    const tarefas = await Tarefa.find({});
    if(tarefas.length === 0){
      return {
        statusCode: 400,
        body: JSON.stringify({erro: "Não há tarefas cadastradas"})
      }
    }
    return{
      statusCode: 200,
      body: JSON.stringify(tarefas)
    };

  }catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
  }
  
}

async function consultarTarefa(id){

  try{
    await conectarBancoDados();
    const tarefaEncontrada = await Tarefa.findById(id);

    if(!tarefaEncontrada){
      return{
        statusCode: 404,
        body: JSON.stringify({erro: "Tarefa não encontrada"})
      }
    }

    return{
      statusCode: 200,
      body: JSON.stringify(tarefaEncontrada)
    }
  }catch (erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
  }
}

async function realizarTarefa(id){
  
  try{
    conectarBancoDados();
    const tarefa = await Tarefa.findById(id);

    if(!tarefa){
      return{
        statusCode: 404,
        body: JSON.stringify({erro: "Tarefa não encontrada"})
      }
    }

    if(tarefa.feito){
      return{
        statusCode: 400,
        body: JSON.stringify({
          erro: "Tarefa já está feita",
          tarefa: tarefa
        })
      }
    }

    tarefa.feito = true;
    await tarefa.save();
    return{
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Tarefa Realizada!",
        tarefa: tarefa
      })
    }
  }catch (erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
  }
}

async function criarTarefa(dados){
  try{
    const validacao = validarDadosPost(dados);
    if(validacao){
      console.log(validacao);
      conectarBancoDados();

      const tarefaCriada = await Tarefa.create(dados);
      return{
        statusCode: 201,
        body: JSON.stringify({
          mensagem: "Tarefa criada com sucesso",
          tarefa: tarefaCriada
        })
      }
      
    }else{
      console.log(validarDadosPost.errors);
      const erros = validarDadosPost.errors;

      const mensagemErro = erros.map(erro =>{
        if(erro.keyword === "required"){
          return `O campo ${erro.params.missingProperty} é obrigatório`
        }

        return erro.message;
      });

      console.log(mensagemErro);
      return{
        statusCode: 400,
        body: JSON.stringify({erro: mensagemErro})
      }
    }
  }catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
  }
}

async function atualizarTarefa(id, dados){
  try{
    conectarBancoDados();
    const validacao = validarDadosPut(dados);

    if(validacao){
      const tarefaAlterada = await Tarefa.findByIdAndUpdate(id, dados);
      return{
        statusCode: 200,
        body: JSON.stringify({mensagem: "Tarefa alterada com sucesso"})
      }
      
      if(!tarefaAlterada){
        return{
          statusCode: 404,
          body: JSON.stringify({erro: "Tarefa não encontrada"})
        }
      }
    }else{
      console.log(validarDadosPut.errors);
      const erros = validarDadosPut.errors;

      const mensagemErro = erros.map(erro =>{
        if(erro.keyword === "required"){
          return `O campo ${erro.params.missingProperty}`
        }

        return erro.message;
      });
      return{
        statusCode: 400,
        body: JSON.stringify({erro: mensagemErro})
      }
    }

  }catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
  }
}

async function excluirTarefa(id){
  try{
    conectarBancoDados();
    const exclusaoResultado = Tarefa.findByIdAndDelete(id);
    if(!exclusaoResultado){
      return{
        statusCode: 404,
        body: JSON.stringify({erro: "Tarefa não encontrada"})
      }
    }
    return{
      statusCode: 200,
      body: JSON.stringify({message: "Tarefa excluída com sucesso"})
    }
  }catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: `Erro interno no servidor: ${erro.message}`})
    }
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
