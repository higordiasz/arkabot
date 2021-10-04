const mongoose = require('mongoose');
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

exports.adicionarGrupo = async function (token, grupo) {
    if (grupo.nome.isNullOrEmpty()) return false;
    let nome = grupo.nome.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    if (grupo.global.isNullOrEmpty()) return false;
    if (!grupo.contas) return false;
    if (!grupo.contas.length) return false;
    if (grupo.contas.length < 1) return false;
    let g = await Grupo.findOne({ token: token, nome: nome });
    if (g != null) return false;
    let aux = new Grupo({
        nome: nome,
        global: grupo.global,
        contas: grupo.contas,
        token: token
    })
    await aux.save();
    return true;
}

exports.alterarGrupo = async function (token, name, grupo) {
    if (grupo.nome.isNullOrEmpty()) return false;
    if (name.isNullOrEmpty()) return false;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    grupo.nome = grupo.nome.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (token.isNullOrEmpty()) return false;
    if (grupo.global.isNullOrEmpty()) return false;
    if (!grupo.contas) return false;
    if (!grupo.contas.length) return false;
    if (grupo.contas.length < 1) return false;
    let g = await Grupo.findOne({ token: token, nome: nome });
    if (!g) return false;
    g.contas = grupo.contas;
    g.global = grupo.global;
    g.nome = grupo.nome;
    await g.save();
    return true;
}

exports.removerGrupo = async function (token, name) {
    if (name.isNullOrEmpty()) return false;
    if (token.isNullOrEmpty()) return false;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    await Grupo.findOneAndDelete({ token: token, nome: nome });
    return true;
}

exports.getGrupoByName = async function (token, name) {
    if (name.isNullOrEmpty()) return null;
    if (token.isNullOrEmpty()) return null;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    let g = await Grupo.findOne({ token: token, nome: nome });
    if (!g) return null;
    let ret = g.toJSON();
    delete ret._id;
    delete ret.__v;
    delete ret.token;
    return ret;
}

exports.getAllGrupo = async function (token) {
    if (token.isNullOrEmpty()) return null;
    let grupos = await Grupo.find({ token: token })
    if (!grupos) return null;
    if (grupos.length < 1) return null;
    let ret = [];
    grupos.forEach(g => {
        let aux = g;
        delete aux._id;
        delete aux.__v;
        delete aux.token;
        ret.push(aux);
    })
    return ret;
}