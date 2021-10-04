const mongoose = require('mongoose');
const Venda = mongoose.model('Venda');
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

exports.adicionarVenda = async function (venda) {
    if (!venda.valor) return;
    if (!venda.origin) return;
    if (!venda.data) return;
    if (!venda.token) return;
    if (!venda.vendedor) return;
    if (!venda.nome) return;
    let v = new Venda({
        valor: venda.valor,
        origin: venda.origin,
        data: venda.data,
        token: venda.token,
        vendedor: venda.vendedor,
        nome: venda.nome
    });
    await v.save();
    return;
}

exports.getTokenVendas = async function (token) {
    let v = await Venda.find({ token: token });
    if (!v) return null;
    if (v.length < 1) return null;
    let ret = [];
    v.forEach(ve => {
        let aux = ve;
        delete ret._id;
        delete ret.__v;
        ret.push(aux);
    })
    return ret;
}