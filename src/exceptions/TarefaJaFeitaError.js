class TarefaJaFeita extends TarefaError{
  constructor(message = "Tarefa já está feita"){
    super(message, 400);
  }
}

module.exports = TarefaJaFeita;