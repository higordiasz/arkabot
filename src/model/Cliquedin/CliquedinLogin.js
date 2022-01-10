const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CliquedinLoginSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    autenticador: {
        type: String,
        required: true
    },
    crypted: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CliquedinLogin', CliquedinLoginSchema);