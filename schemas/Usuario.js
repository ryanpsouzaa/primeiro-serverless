const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema( {
  id: {type: mongoose.Schema.Types.ObjectId },
  username: { type: String },
  senha : { type: String },
}, {versionKey: false});

const usuario = mongoose.model("usuarios", usuarioSchema);

module.exports = usuario;