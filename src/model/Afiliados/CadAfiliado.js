const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CadAfiliadoSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  token_afiliado: {
    type: String,
    required: true
  },
  token_cadastrado: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CadAfiliado', CadAfiliadoSchema);