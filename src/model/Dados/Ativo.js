const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AtivoSchema = new Schema({
    token: {
        type: Array,
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

module.exports = mongoose.model('DadosAtivo', AtivoSchema);