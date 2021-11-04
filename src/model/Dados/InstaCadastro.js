const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CadastroInstaSchema = new Schema({
    qtd: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosCadastroInsta', CadastroInstaSchema);