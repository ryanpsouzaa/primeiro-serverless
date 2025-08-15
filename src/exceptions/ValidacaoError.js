const TarefaError = require("../exceptions/TarefaError.js");

class ValidacaoError extends TarefaError{
  constructor(message){
    super(message, 400);
  }
}

module.exports = ValidacaoError;