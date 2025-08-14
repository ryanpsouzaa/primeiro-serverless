const Ajv = require("ajv");

const postSchema = require("./postTarefa.json");
const putSchema = require("./putTarefa.json");

const ajv = new Ajv();

const validadorDadosPost = ajv.compile(postSchema);
const validadorDadosPut = ajv.compile(putSchema);

module.exports = {validadorDadosPost, validadorDadosPut};
