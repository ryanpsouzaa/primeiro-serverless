const {conectarBancoDados} = require("./config/dbConnect.js");
const tarefa = require("./schemas/Tarefa.js");
const usuario = require("./schemas/Usuario.js");

async function getTarefas(event) {
  await conectarBancoDados();

  const tarefas = await tarefa.find({});
  if(tarefas.length === 0){
    return {
      statusCode: 400,
      body: JSON.stringify({erro: "Não há tarefas cadastradas no momento."})
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(tarefas)
  }
}

async function consultarTarefa(event){
  await conectarBancoDados();

  try{
    const { id } = event.pathParameters;
    const tarefaEncontrada = await tarefa.findById(id);

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

  }catch(error){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: "Erro interno no servidor"})
    }
  }
}

async function tarefaRealizada(event){
  const { id } = event.pathParameters;
  conectarBancoDados();
  try{
    const tarefaRealizada = tarefa.findById(id);
    if(tarefaRealizada.feito){
      return {
        statusCode: 400,
        body: JSON.stringify({erro: "Tarefa já está realizada"})
      }
    }
    tarefaRealizada.feito = true;
    return{
      statusCode: 200,
      body: JSON.stringify({mensagem: "Tarefa realizada!"})
    }
  } catch(erro){
    return{
      statusCode: 404,
      body: JSON.stringify({erro: "Tarefa não encontrada"})
    }
  }
}

function extrairBody(event){
  if(!event?.body){
    return {
      statusCode: 422,
      body: JSON.stringify({error: "Corpo da requisição não enviado"})
    }
  }
  return JSON.parse(event.body);
}

async function postTarefas(event){
  const body = extrairBody(event);

  if(body?.statusCode){
    return body;
  }

  await conectarBancoDados();

  try{
    const tarefaCadastrada = await tarefa.create(body);
    return{
      statusCode: 201,
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        mensagem: "Tarefa cadastrada com sucesso",
        tarefa: tarefaCadastrada
      })
    }

  }catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: "Erro interno no servidor"})
    }
  }
}

async function atualizarTarefa(event){
  conectarBancoDados();
  const putBody = extrairBody(event);
  const { id } = event.pathParameters;

  try{
    const putResultado = tarefa.findByIdAndUpdate(id, putBody);
    return {
      statusCode: 200,
      body: JSON.stringify(putResultado)
    }

  }catch (error){
    return{
      statusCode:404,
      body: JSON.stringify({erro: "Tarefa não encontrada"})
    }
  }
}

async function deletarTarefa(event){
  const { id } = event.pathParameters;
  conectarBancoDados();
  try{
    const deleteResultado = await tarefa.findByIdAndDelete(id);
    if(!deleteResultado){
      return{
        statusCode: 404,
        body: JSON.stringify({erro: "Tarefa não encontrada"})
      }
    }

    return{
      statusCode: 200,
      body: JSON.stringify({message: "Tarefa excluída com sucesso"})
    }

  } catch(error){
    return {
      statusCode: 500,
      body: JSON.stringify({erro: "Erro interno no servidor"})
    }
  }
}

module.exports = {
  getTarefas,
  consultarTarefa,
  postTarefas,
  deletarTarefa,
  atualizarTarefa,
  tarefaRealizada

}

