const {conectarBancoDados} = require("../../config/dbConnect.js");
const {tarefa} = require("../schemas/Tarefa.js");

const Ajv = require("ajv");

const postSchema = require("../validacao/postTarefa.json");
const putSchema = require("../validacao/putTarefa.json");

const ajv = new Ajv();
const validarDadosPost = ajv.compile(postSchema);
const validarDadosPut = ajv.compile(putSchema);

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
    const tarefaRealizada = await tarefa.findById(id);
    if(!tarefaRealizada){
      return{
        statusCode: 404,
        body: JSON.stringify({erro: "Tarefa não encontrada"})
      }
    }

    if(tarefaRealizada.feito){
      return {
        statusCode: 400,
        body: JSON.stringify({erro: "Tarefa já está realizada"})
      }
    }
    tarefaRealizada.feito = true;
    await tarefaRealizada.save();
    return{
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Tarefa realizada!",
        tarefa: tarefaRealizada
      })
    }
  } catch(erro){
    return{
      statusCode: 500,
      body: JSON.stringify({erro: "Erro interno no servidor"})
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
  const validacao = validarDadosPost(body);
  if(validacao){
    console.log(validacao);
    console.log("entrou na validacao dos dados");
    conectarBancoDados();
    console.log("conectado BD");

    try{
      await conectarBancoDados();
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
    return {
      statusCode: 400,
      body: JSON.stringify({erro: mensagemErro})
      }
    }
} 

async function atualizarTarefa(event){
  conectarBancoDados();
  const putBody = extrairBody(event);
  if(putBody?.statusCode){
    return putBody;
  }
  if(validarDadosPut(putBody)){
    const { id } = event.pathParameters;
    try{
      const putResultado = await tarefa.findByIdAndUpdate(id, putBody);
      if(!putResultado){
        return{
          statusCode: 404,
          body: JSON.stringify({erro: "Tarefa não encontrada"})
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify(putResultado)
      }

    }catch (error){
      return{
        statusCode: 500,
        body: JSON.stringify({erro: "Erro interno no servidor"})
      }
    }
  }else{
    return{
      statusCode: 400,
      body: JSON.stringify({erro: "Dados invalidos"})
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
};