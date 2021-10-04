const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');
const md5 = require('md5');
const moment = require('moment');

String.prototype.ReplaceAll = function (stringToFind, stringToReplace) {
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};

String.prototype.isNullOrEmpty = function () {
    if (this == null) return true;
    if (this == "") return true;
    if (this.ReplaceAll(" ", "") == "") return true;
    return false;
}

exports.adicionarPayment = async function (payment, paymentID, userToken) {
    let p = await Payment.findOne({ paymentID: paymentID });
    if (p != null) return false;
    let pay = new Payment({
        status: payment.response.status,
        transaction_amount: payment.response.transaction_amount,
        order_id: payment.response.order.id,
        paymentID: paymentID,
        token: userToken
    });
    await pay.save();
    return true;
}

exports.checkPaymentID = async function (paymentID) {
    let p = await Payment.findOne({paymentID: paymentID});
    if(!p) return false;
    return true;
}