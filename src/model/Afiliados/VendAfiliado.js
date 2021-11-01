const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendAfiliadoSchema = new Schema({
  token_afiliado: {
    type: String,
    required: true
  },
  token_cadastrado: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  receita: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('VendAfiliado', VendAfiliadoSchema);