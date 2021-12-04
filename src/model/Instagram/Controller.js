const mongoose = require('mongoose');
const Instagram = mongoose.model('Instagram');
const Grupo = mongoose.model('Grupo');
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

exports.adicionarConta = async function (token, conta) {
    if (conta.username.isNullOrEmpty()) return false;
    let username = conta.username.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    if (conta.password.isNullOrEmpty()) return false;
    if (conta.mobile.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (i != null) return false;
    i = new Instagram({
        username: username,
        password: conta.password,
        categoria: conta.categoria,
        mobile: conta.mobile,
        block: conta.block,
        challenge: conta.challenge,
        incorrect: conta.incorrect,
        seguir: conta.seguir,
        curtir: conta.curtir,
        token: token
    });
    await i.save();
    return true;
}

exports.removerConta = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    await Instagram.findOneAndDelete({ token: token, username: username });
    let grupos = await Grupo.find({ token: token, contas: username });
    if (grupos.length > 0) {
        grupos.forEach(g => {
            let lenght = g.contas.length
            for (var i = 0; i < g.contas.length; i++) {
                if (g.contas[i] === username) {
                    g.contas.splice(i, 1);
                    i--;
                }
            }
            if (lenght == 1) {
                g.delete();
            } else {
                g.save();
            }
        })
    }
    return true;
}

exports.alterarConta = async function (token, username2, newPassword) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    if (newPassword.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.password = newPassword;
    await i.save();
    return true;
}

exports.getContaByUsername = async function (token, username2) {
    if (username2.isNullOrEmpty()) return null;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return null;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return null;
    let ret = i.toJSON();
    delete ret._id;
    delete ret.__v;
    delete ret.token;
    return ret;
}

exports.getAllContasByCategoria = async function (token, categoria) {
    if (token.isNullOrEmpty()) return [];
    let contas = await Instagram.find({ categoria: categoria });
    if (!contas) return [];
    if (contas.length < 1) return [];
    let ret = [];
    contas.forEach(i => {
        let aux = i;
        delete aux._id;
        delete aux.__v;
        delete aux.token;
        ret.push(aux);
    })
    return ret;
}

exports.getAllContas = async function (token) {
    if (token.isNullOrEmpty()) return null;
    let contas = await Instagram.find({ token: token })
    if (!contas) return null;
    if (contas.length < 1) return null;
    let ret = [];
    contas.forEach(i => {
        let aux = i;
        delete aux._id;
        delete aux.__v;
        delete aux.token;
        ret.push(aux);
    })
    return ret;
}

exports.adicionarBlock = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.block = true;
    await i.save();
    return true;
}

exports.removerBlock = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.block = false;
    await i.save();
    return true;
}

exports.adicionarChallenge = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.challenge = true;
    await i.save();
    return true;
}

exports.removerChallenge = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.challenge = false;
    await i.save();
    return true;
}

exports.adicionarIncorrect = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.incorrect = true;
    await i.save();
    return true;
}

exports.removerIncorrect = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.incorrect = false;
    await i.save();
    return true;
}

exports.adicionarSeguir = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.seguir = i.seguir + 1;
    await i.save();
    return true;
}

exports.adicionarCurtir = async function (token, username2) {
    if (username2.isNullOrEmpty()) return false;
    let username = username2.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    let i = await Instagram.findOne({ token: token, username: username });
    if (!i) return false;
    i.curtir = i.curtir + 1;
    await i.save();
    return true;
}

exports.atualizarOldInstagrans = async function () {
    try {
        var instas = await Instagram.find();
        let j = 1;
        console.log(instas.length);
        instas.forEach(async (i) => {
            console.log(j + ` - Username: ${i.username}`)
            let aux = i;
            delete aux._id;
            delete aux.__v;
            aux.categoria = "old";
            let n = new Instagram(aux);
            await n.save();
            await i.delete();
            j++;
        })
    } catch (err) {
        console.log(err);
    }
    console.log("concluido!!");
    return;
}