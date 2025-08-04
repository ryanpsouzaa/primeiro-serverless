const {MongoClient} = require("mongodb");

async function conectarBancoDados(){
  const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING);
  const connection = await client.connect();

  return connection.db(process.env.MONGODB_DB_NAME);
}

module.exports.getTarefas = async (event) => {
  const client = await conectarBancoDados();
  const collection = client.collection('tarefas');
  const tarefas = await collection.find({}).toArray();
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

module.exports.postTarefas = async (event) => {
  const body = extrairBody(event);
  const client = await conectarBancoDados();
  const collection = client.collection("tarefas");
  const { insertedId } = await collection.insertOne(body);
  return{
    statusCode: 201,
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      tarefaCriada: insertedId,
      __hypermedia:{
          href: "/tarefas.html",
          query: {id: insertedId}
      }
    })
  }
}

