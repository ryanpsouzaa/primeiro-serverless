const mongoose = require("mongoose");

const tarefaSchema = new mongoose.Schema( {
  id: {type: mongoose.Schema.Types.ObjectId },
  nome: { type: String, required : [true, "Campo nome é obrigatório"] },
  descricao : { type: String },
  feito : { type: Boolean, default: false }

}, {versionKey: false});

module.exports = mongoose.model("tarefas", tarefaSchema);