const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CliquedinOpenSchema = new Schema({
    data: {
        type: String,
        required: true
    },
    qtd: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('CliquedinOpen', CliquedinOpenSchema);