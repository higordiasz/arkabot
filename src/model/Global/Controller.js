const mongoose = require('mongoose');
const Global = mongoose.model('Global');
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

exports.createGlobal = async function (token, global) {
    if (token.isNullOrEmpty()) return false;
    if (global.nome.isNullOrEmpty()) return false;
    if (global.delay1.toString().isNullOrEmpty()) return false;
    if (global.delay2.toString().isNullOrEmpty()) return false;
    if (global.quantidade.toString().isNullOrEmpty()) return false;
    if (global.tcontas.toString().isNullOrEmpty()) return false;
    if (global.meta.toString().isNullOrEmpty()) return false;
    if (global.tmeta.toString().isNullOrEmpty()) return false;
    if (global.tblock.toString().isNullOrEmpty()) return false;
    if (global.cgrupo.toString().isNullOrEmpty()) return false;
    if (global.anonimo.toString().isNullOrEmpty()) return false;
    if (global.trocar.toString().isNullOrEmpty()) return false;
    if (global.perfil.toString().isNullOrEmpty()) return false;
    if (global.barra.toString().isNullOrEmpty()) return false;
    let nome = global.nome.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    let g = await Global.findOne({ token: token, nome: global.nome });
    if (g != null) return false;
    let aux = new Global({
        nome: nome,
        delay1: global.delay1,
        delay2: global.delay2,
        quantidade: global.quantidade,
        tcontas: global.tcontas,
        meta: global.meta,
        tmeta: global.tmeta,
        tblock: global.tblock,
        cgrupo: global.cgrupo,
        anonimo: global.anonimo,
        trocar: global.trocar,
        perfil: global.perfil,
        barra: global.barra,
        token: token
    });
    await aux.save();
    return true;
}

exports.alterGlobal = async function (token, name, novo) {
    if (token.isNullOrEmpty()) return false;
    if (novo.nome.isNullOrEmpty()) return false;
    if (novo.delay1.toString().isNullOrEmpty()) return false;
    if (novo.delay2.toString().isNullOrEmpty()) return false;
    if (novo.quantidade.toString().isNullOrEmpty()) return false;
    if (novo.tcontas.toString().isNullOrEmpty()) return false;
    if (novo.meta.toString().isNullOrEmpty()) return false;
    if (novo.tmeta.toString().isNullOrEmpty()) return false;
    if (novo.tblock.toString().isNullOrEmpty()) return false;
    if (novo.cgrupo.toString().isNullOrEmpty()) return false;
    if (novo.anonimo.toString().isNullOrEmpty()) return false;
    if (novo.trocar.toString().isNullOrEmpty()) return false;
    if (novo.perfil.toString().isNullOrEmpty()) return false;
    if (novo.barra.toString().isNullOrEmpty()) return false;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    let g = await Global.findOne({ token: token, nome: nome });
    if (!g) return false;
    novo.nome = novo.nome.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    g.nome = novo.nome
    g.delay1 = novo.delay1
    g.delay2 = novo.delay2
    g.quantidade = novo.quantidade
    g.tcontas = novo.tcontas
    g.meta = novo.meta
    g.tmeta = novo.tmeta
    g.tblock = novo.tblock
    g.cgrupo = novo.cgrupo
    g.anonimo = novo.anonimo
    g.trocar = novo.trocar
    g.perfil = novo.perfil
    g.barra = novo.barra
    await g.save();
    return true;
}

exports.removeGlobalByName = async function (token, name) {
    if (token.isNullOrEmpty()) return false;
    if (name.isNullOrEmpty()) return false;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    await Global.findOneAndDelete({ token: token, nome: nome });
    let grupos = await Grupo.find({ token: token, global: nome });
    if (grupos != null) {
        grupos.forEach(g => {
            g.delete();
        })
    }
    return true;
}

exports.getGlobalByName = async function (token, name) {
    if (token.isNullOrEmpty()) return null;
    if (name.isNullOrEmpty()) return null;
    let nome = name.ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
    if (nome == "conservador" || nome == "agressivo") {
        if (nome == "conservador") {
            let g = {
                "nome":"conservador",
                "delay1":60,
                "delay2":120,
                "quantidade":100,
                "tcontas":60,
                "meta":300,
                "tmeta":420,
                "tblock":720,
                "cgrupo":0,
                "anonimo":true,
                "trocar":false,
                "perfil":true,
                "barra":false
            };
            return g;
        } else {
            let g = {
                "nome":"agressivo",
                "delay1":25,
                "delay2":38,
                "quantidade":300,
                "tcontas":30,
                "meta":900,
                "tmeta":200,
                "tblock":420,
                "cgrupo":1,
                "anonimo":true,
                "trocar":true,
                "perfil":false,
                "barra":true
            };
            return g;
        }
    }
    let g = await Global.findOne({ token: token, nome: nome });
    if (!g) return null;
    let ret = g.toJSON();
    delete ret._id;
    delete ret.__v;
    delete ret.token;
    return ret;
}

exports.getAllGlobal = async function (token) {
    if (token.isNullOrEmpty()) return null;
    let g = await Global.find({ token: token });
    if (!g) return null;
    if (g.length < 1) return null;
    let ret = [];
    g.forEach(gl => {
        let aux = gl;
        delete aux._id;
        delete aux.__v;
        delete aux.token;
        ret.push(aux);
    });
    return ret;
}