/*//const db = require('quick.db');
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

const Payment = new Object({
    adicionarPayment: async function (payment, paymentID, userToken) {
        if (await db.get(`arka.payments.${paymentID}`) != null) {
            let paymentJson = {
                "status":payment.response.status,
                "transaction_amount":payment.response.transaction_amount,
                "order_id":payment.response.order.id,
                "paymentID": paymentID,
                "token":userToken
            }
            db.set(`arka.payments.${paymentID}`, paymentJson);
        }
        return;
    },
    checkPaymentID: async function (paymentID) {
        if (await db.get(`arka.payments.${paymentID}`) != null) {
            return true;
        } else {
            return false;
        };
    }
})

module.exports = Payment;*/