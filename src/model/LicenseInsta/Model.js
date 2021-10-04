const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LicenseInstaSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    aquisicao: {
        type: String,
        required: true
    },
    final: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('LicenseInsta', LicenseInstaSchema);