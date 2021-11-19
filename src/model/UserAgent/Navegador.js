const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NavegadorUASchema = new Schema({
    ua: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('NavegadorUA', NavegadorUASchema);