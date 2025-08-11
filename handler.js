import conectarBancoDados from "./config/dbConnect.js";
import tarefa from "./schemas/Tarefa.js";
import usuario from "./schemas/Usuario.js";
import pkg from "jsonwebtoken";
import crypto from "crypto";

export const {sign, verify} = pkg;

export async function getTarefas(event) {
  const autenticacaoResultado = await autorizar(event);
  if(autenticacaoResultado.statusCode === 401) return autenticacaoResultado;
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
  const autenticacaoResultado = await autorizar(event);
  if(autenticacaoResultado.statusCode === 401) return autenticacaoResultado
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

export async function autorizar(event){
  const {authorization} = event.headers;
  if(!authorization){
    return{
      statusCode: 401,
      body: JSON.stringify("Credenciais de Autorização devem ser enviadas")
    }
  }

  const [type, token] = authorization.split(" ")
  if(type != "Bearer" || !token){
    return{
      statusCode: 401,
      body: JSON.stringify("Tipo de token inválido")
    }
  }

  try{
    const tokenDecoded = verify(token, process.env.JWT_SECRET,
      { audience: "ryan-serverless" });
    return tokenDecoded;

  } catch(error){
    return {
      statusCode: 401,
      body: JSON.stringify({error: "Token inválido"})
    }
  }
}

export async function login(event){
  const {usernameLogin, senhaLogin} = extrairBody(event);
  conectarBancoDados();
  console.log(process.env.SALT);
  
  const senhaHash = crypto.pbkdf2Sync(
    senhaLogin, process.env.SALT, 100000, 64, 'sha512').toString('hex');

  console.log(senhaHash);
  
  const userEncontrado = await usuario.findOne({
    username: usernameLogin, senha: senhaHash});

  console.log(userEncontrado);

  if(!userEncontrado){
    return{
      statusCode: 401,
      body: JSON.stringify("Credenciais inválidas")
    }
  }

  const token = sign({usernameLogin, id: userEncontrado._id},
    process.env.JWT_SECRET, {
      expiresIn : "2h",
      audience: "ryan-serverless"
    })

  return{
    statusCode: 200,
    headers: {
      'Content-Type' : "application/json"
    },
    body: JSON.stringify({token})
  }
}

