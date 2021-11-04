const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BloqeioSchema = new Schema({
    tipo: {
        type: Number,
        required: true
    },
    qtd: {
        type: Number,
        required: true
    },
    contas: {
        type: Array,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosBloqueio', BloqeioSchema);