const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PagAfiliadoSchema = new Schema({
  token_afiliado: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pix: {
    type: Number,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  comprovante: {
    type: String,
    required: true
  },
  confirmado: {
    type: Boolean,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PagAfiliado', PagAfiliadoSchema);