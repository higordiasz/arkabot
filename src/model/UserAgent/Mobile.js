const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobileUASchema = new Schema({
    ua: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('MobileUA', MobileUASchema);