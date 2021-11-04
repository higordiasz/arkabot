const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CadastroSchema = new Schema({
    qtd: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosCadastro', CadastroSchema);