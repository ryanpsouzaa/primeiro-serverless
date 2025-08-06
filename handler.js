import conectarBancoDados from "./config/dbConnect.js";
import tarefa from "./schemas/Tarefa.js";

export async function getTarefas(event) {
  await conectarBancoDados();

  const tarefas = await tarefa.find({});
  return {
    statusCode: 200,
    body: JSON.stringify(tarefas)
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

export async function postTarefas(event){
  const body = extrairBody(event);
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
}

