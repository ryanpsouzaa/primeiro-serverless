//services
const {
  listarTarefas, consultarTarefa, criarTarefa,
  atualizarTarefa, realizarTarefa, excluirTarefa
} = require("../services/tarefaService.js");


async function getTarefas(event) {
  const response = await listarTarefas();
  return response;
}

async function getOneTarefa(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }

  }else{
    const response = await consultarTarefa(id);
    return response;
  }
}

async function tarefaRealizada(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }

  }else{
    const response = await realizarTarefa(id);
    return response;
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
    //body com statusCode 422
    return body;
  }
  const response = await criarTarefa(body);
  return response
} 

async function putTarefa(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }
  }

  const body = extrairBody(event);
  if(body?.statusCode){
    //body com statusCode 422
    return body;
  }

  const response = await atualizarTarefa(id, body);
  return response;
}

async function deleteTarefa(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }
  }

  const response = await excluirTarefa(id);
  return response;
}

module.exports = {
  getTarefas,
  getOneTarefa,
  postTarefas,
  deleteTarefa,
  putTarefa,
  tarefaRealizada
};