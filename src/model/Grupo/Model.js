const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrupoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  global: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  contas: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Grupo', GrupoSchema);