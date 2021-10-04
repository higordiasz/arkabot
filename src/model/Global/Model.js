const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GlobalSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    delay1: {
        type: Number,
        required: true
    },
    delay2: {
        type: Number,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    tcontas: {
        type: Number,
        required: true
    },
    meta: {
        type: Number,
        required: true
    },
    tmeta: {
        type: Number,
        required: true
    },
    tblock: {
        type: Number,
        required: true
    },
    cgrupo: {
        type: Number,
        required: true
    },
    anonimo: {
        type: Boolean,
        required: true
    },
    trocar: {
        type: Boolean,
        required: true
    },
    perfil: {
        type: Boolean,
        required: true
    },
    barra: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Global', GlobalSchema);