class TarefaNaoEncontrada extends TarefaError{
  constructor(message = "Tarefa não encontrada"){
    super(message, 404);
  }
}

module.exports = TarefaNaoEncontrada;