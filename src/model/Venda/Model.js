const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendaSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    vendedor: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Venda', VendaSchema);