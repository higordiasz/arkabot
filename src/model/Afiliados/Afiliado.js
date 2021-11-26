const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AfiliadoSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  receita: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Afiliado', AfiliadoSchema);