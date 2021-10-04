const mongoose = require('mongoose');
const Conta = mongoose.model('Conta');
const md5 = require('md5');

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

exports.findByEmail = async function (email) {
    let e = email.ReplaceAll(" ", "").toLowerCase();
    let User = await Conta.findOne({ email: e });
    if (User != null) {
        let ret = User.toJSON();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
    return null;
}

exports.findByToken = async function (token) {
    let e = token.ReplaceAll(" ", "").toLowerCase();
    let User = await Conta.findOne({ token: e });
    if (User != null) {
        let ret = User.toJSON();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
    return null;
}

exports.loginAccount = async function (email, password) {
    let e = email.ReplaceAll(" ", "").toLowerCase();
    let senha = md5(password)
    let token = md5('arkatokengenerate' + e);
    let User = await Conta.findOne({ token: token });
    if (User != null) {
        let ret = User.toJSON();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
    return null;
}

exports.createAccount = async function (email, password, avatar = "nada") {
    let e = email.ReplaceAll(" ", "").toLowerCase();
    if (await Conta.findOne({ email: e }) != null) return null;
    let token = md5('arkatokengenerate' + e);
    let senha = md5(password);
    let User = new Conta({
        token: token,
        email: e,
        password: senha,
        avatar: avatar != "" ? avatar : "nada"
    });
    await User.save();
    let ret = User.toJSON();
    delete ret._id;
    delete ret.__v;
    return ret;
}

exports.alterAvatar = async function (token, url) {
    let User = await Conta.findOne({ token: token });
    if (User != null) {
        User.avatar = url;
        await User.save();
    }
    return true;
}

exports.alterPassword = async function (token, newPass) {
    let User = await Conta.findOne({ token: token });
    if (!User) return false;
    let senha = md5(newPass)
    User.password = senha;
    await User.save();
    return true;
}

exports.deleteAll = async function (token) {
    await Conta.findOneAndDelete({ token: token });
    return true;
}