const mongoose = require("mongoose");

let estaConectado;

async function conectarBancoDados(){
  if(estaConectado) return;

  try{

    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, {
      dbName: process.env.MONGO_DB_NAME,
    });

    estaConectado = true;
    console.log("Mongo conectado com sucesso");
  } catch (error){
    console.log("Error: ", error)
    throw error;
  }
};

module.exports = conectarBancoDados;