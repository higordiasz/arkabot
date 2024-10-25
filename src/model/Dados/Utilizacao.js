const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UtilizacaoSchema = new Schema({
    tipo: {
        type: Number,
        required: true
    },
    plat: {
        type: Number,
        required: true
    },
    qtd: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosUtilizacao', UtilizacaoSchema);