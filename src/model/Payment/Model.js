const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    transaction_amount: {
        type: Number,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);