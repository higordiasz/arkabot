const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContaSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Conta', ContaSchema);