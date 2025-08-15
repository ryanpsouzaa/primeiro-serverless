//services
const {
  listarTarefas, consultarTarefa, criarTarefa,
  atualizarTarefa, realizarTarefa, excluirTarefa
} = require("../services/tarefaService.js");

function retornarErroResponse(erro, mensagem = erro.message){
  return{
    statusCode: erro.statusCode || 500,
    body: JSON.stringify({erro: mensagem})
  };
}

async function getTarefas(event) {
  try{
    const response = await listarTarefas();

    return{
      statusCode: 200,
      body: JSON.stringify(response)
    };

  }catch(erro){
    return retornarErroResponse(erro);
  }
}

async function getOneTarefa(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }
  }else{
    try{
      const response = await consultarTarefa(id);
      return{
        statusCode: 200,
        body: JSON.stringify(response)
      }

    }catch(erro){
      return retornarErroResponse(erro);
    }
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
    try{
      const response = await realizarTarefa(id);
      return{
        statusCode: 200,
        body: JSON.stringify({
          message: "Tarefa realizada com sucesso!",
          tarefa: response
        })
      }

    }catch(erro){
      return retornarErroResponse(erro);
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
    //body com statusCode 422
    return body;
  }
  try{
    const response = await criarTarefa(body);
    return{
      statusCode: 201,
      body: JSON.stringify({
        mensagem: "Tarefa criada com sucesso",
        tarefa: response
      })
    }

  }catch(erro){
    return retornarErroResponse(erro)
  }
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

  try{
    const response = await atualizarTarefa(id, body);
    return{
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Tarefa atualizada com sucesso",
        tarefa: response
      })
    };

  }catch(erro){
    return retornarErroResponse(erro);
  }
}

async function deleteTarefa(event){
  const {id} = event.pathParameters;
  if(!id){
    return{
      statusCode: 422,
      body: JSON.stringify({erro: "É obrigatório o fornecimento do Id"})
    }
  }
  try{
    const response = await excluirTarefa(id);
    return{
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Tarefa excluída com sucesso",
        tarefa: response
      })
    }

  }catch(erro){
    return retornarErroResponse(erro);
  }
}

module.exports = {
  getTarefas,
  getOneTarefa,
  postTarefas,
  deleteTarefa,
  putTarefa,
  tarefaRealizada
};