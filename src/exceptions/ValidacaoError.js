class ValidacaoError extends Error{
  constructor(message){
    super(message, 400);
  }
}

module.exports = ValidacaoError;