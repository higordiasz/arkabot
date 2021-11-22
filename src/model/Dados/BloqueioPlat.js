const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BloqeioPlatSchema = new Schema({
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
    },
    plat: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('DadosBloqueioPlat', BloqeioPlatSchema);