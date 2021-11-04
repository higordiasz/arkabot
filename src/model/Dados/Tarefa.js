const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TarefaSchema = new Schema({
    seguir: {
        type: Number,
        required: true
    },
    curtir: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('DadosTarefa', TarefaSchema);