const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatAtivoSchema = new Schema({
    token: {
        type: Array,
        required: true
    },
    qtd: {
        type: Number,
        required: true
    },
    plat: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosPlatAtivo', PlatAtivoSchema);