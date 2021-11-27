const mongoose = require('mongoose');
const Conta = mongoose.model('Conta');
const Afiliado = mongoose.model('Afiliado');
const CadAfiliado = mongoose.model('CadAfiliado');
const VendAfiliado = mongoose.model('VendAfiliado');
const PagAfiliado = mongoose.model('PagAfiliado');
const UserController = require('../Conta/Controller');
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

exports.getAfiliadoByToken = async function (token) {
    try {
        let afiliado = await Afiliado.findOne({ token: token });
        if (afiliado != null) {
            let ret = afiliado.toJSON();
            delete ret._id;
            delete ret.__v;
            return ret;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

exports.getAfiliadoByCode = async function (code) {
    try {
        let afiliado = await Afiliado.findOne({ code: code });
        if (afiliado != null) {
            let ret = afiliado.toJSON();
            delete ret._id;
            delete ret.__v;
            return ret;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

exports.getAfiliadoByEmail = async function (email) {
    try {
        let afiliado = await Afiliado.findOne({ email: email });
        if (afiliado != null) {
            let ret = afiliado.toJSON();
            delete ret._id;
            delete ret.__v;
            return ret;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

exports.addAfiliado = async function (af) {
    try {
        let afiliado = await Afiliado.findOne({ token: af.token });
        if (afiliado == null) {
            afiliado = await Afiliado.findOne({ code: af.code });
            if (afiliado == null) {
                afiliado = await Afiliado.findOne({ email: af.email });
                if (afiliado == null) {
                    afiliado = new Afiliado({
                        token: af.token,
                        email: af.email,
                        code: af.code,
                        receita: 0.0
                    });
                    await afiliado.save();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

exports.deleteAfiliadoByToken = async function (token) {
    try {
        let a = await Afiliado.findOneAndDelete({ token: token });
        return true;
    } catch {
        return false;
    }
}

exports.deleteAfiliadoByEmail = async function (email) {
    try {
        let a = await Afiliado.findOneAndDelete({ email: email });
        return true;
    } catch {
        return false;
    }
}

exports.deleteAfiliadoByCode = async function (code) {
    try {
        let a = await Afiliado.findOneAndDelete({ code: code });
        return true;
    } catch {
        return false;
    }
}

exports.addCadAfiliadoByCodeAfiliado = async function (cadastro, code) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
        let afiliado = await Afiliado.findOne({ code: code });
        if (afiliado != null) {
            if (!cadastro.token_cadastrado) return false;
            if (!cadastro.email) return false;
            let cad = await CadAfiliado.findOne({ token_cadastrado: cadastro.token_cadastrado });
            if (cad == null) {
                cad = new CadAfiliado({
                    token_cadastrado: cadastro.token_cadastrado,
                    token_afiliado: afiliado.token,
                    email: cadastro.email,
                    data: hoje.format("DD/MM/YYYY").toString()
                });
                await cad.save();
                return true;
            } else {
                console.log(1)
                return false;
            }
        } else {
            console.log(2)
            return false;
        }
    } catch (err) {
        console.log(err)
        return false;
    }
}

exports.addCadAfiliadoByTokenAfiliado = async function (cadastro, token) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
        let afiliado = await Afiliado.findOne({ token: token });
        if (afiliado != null) {
            if (!cadastro.token_cadastrado) return false;
            if (!cadastro.email) return false;
            let cad = await CadAfiliado.findOne({ token_cadastrado: cadastro.token_cadastrado });
            if (cad == null) {
                cad = new CadAfiliado({
                    token_cadastrado: cadastro.token_cadastrado,
                    token_afiliado: afiliado.token,
                    email: cadastro.email,
                    data: hoje.format("DD/MM/YYYY").toString()
                });
                await cad.save();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

exports.addCadAfiliadoByEmailAfiliado = async function (cadastro, email) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
        let afiliado = await Afiliado.findOne({ email: email });
        if (afiliado != null) {
            if (!cadastro.token_cadastrado) return false;
            if (!cadastro.email) return false;
            let cad = await CadAfiliado.findOne({ token_cadastrado: cadastro.token_cadastrado });
            if (cad == null) {
                cad = new CadAfiliado({
                    token_cadastrado: cadastro.token_cadastrado,
                    token_afiliado: afiliado.token,
                    email: cadastro.email,
                    data: hoje.format("DD/MM/YYYY").toString()
                });
                await cad.save();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

exports.getAllCadAfiliadoByTokenAfiliado = async function (token) {
    try {
        let afiliado = await Afiliado.findOne({ token: token });
        if (afiliado != null) {
            let cads = await CadAfiliado.find({ token_afiliado: afiliado.token });
            if (cads != null) {
                if (cads.length > 0) {
                    let array = [];
                    for (let i = 0; i < cads.length; i++) {
                        let ret = cads[i].toJSON();
                        let oldEmail = ret.email;
                        let init = oldEmail.substr(0, 2);
                        let aray = oldEmail.split('@');
                        let end = aray[aray.length - 1];
                        ret.email = init + "**********" + "@" + end;
                        delete ret._id;
                        delete ret.__v;
                        array.push(ret);
                    }
                    return array;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

exports.getAllCadAfiliadoByEmailAfiliado = async function (email) {
    try {
        let afiliado = await Afiliado.findOne({ email: email });
        if (afiliado != null) {
            let cads = await CadAfiliado.find({ token_afiliado: afiliado.token });
            if (cads != null) {
                if (cads.length > 0) {
                    let array = [];
                    for (let i = 0; i < cads.length; i++) {
                        let ret = cads[i].toJSON();
                        let oldEmail = ret.email;
                        let init = oldEmail.substr(0, 2);
                        let aray = oldEmail.split('@');
                        let end = aray[aray.length - 1];
                        ret.email = init + "**********" + "@" + end;
                        delete ret._id;
                        delete ret.__v;
                        array.push(ret);
                    }
                    return array;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

exports.getAllCadAfiliadoByCodeAfiliado = async function (code) {
    try {
        let afiliado = await Afiliado.findOne({ code: code });
        if (afiliado != null) {
            let cads = await CadAfiliado.find({ token_afiliado: afiliado.token });
            if (cads != null) {
                if (cads.length > 0) {
                    let array = [];
                    for (let i = 0; i < cads.length; i++) {
                        let ret = cads[i].toJSON();
                        let oldEmail = ret.email;
                        let init = oldEmail.substr(0, 2);
                        let aray = oldEmail.split('@');
                        let end = aray[aray.length - 1];
                        ret.email = init + "**********" + "@" + end;
                        delete ret._id;
                        delete ret.__v;
                        array.push(ret);
                    }
                    return array;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

exports.getReceitAfiliadosByToken = async function () {

}

exports.getReceitAfiliadosByEmail = async function () {

}

exports.getReceitAfiliadosByCode = async function () {

}

exports.addVendAfiliados = async function (token, value) {
    console.log(token);
    console.log(value);
    console.log(1);
    try {
        let user = await UserController.findByToken(token);
        console.log(2);
        if (user != null) {
            console.log(3);
            let cad = await CadAfiliado.findOne({ token_cadastrado: token })
            console.log(4);
            if (cad != null) {
                console.log(5);
                let tokenAfiliado = cad.token_afiliado;
                console.log(6);
                let afiliado = await Afiliado.findOne({ token: tokenAfiliado });
                console.log(7);
                if (afiliado != null) {
                    console.log(8);
                    let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
                    var receita = value * 0.07;
                    console.log(receita);
                    afiliado.receita += receita;
                    console.log(9);
                    var vendAfiliado = new VendAfiliado({
                        token_afiliado: tokenAfiliado,
                        token_cadastrado: user.token,
                        valor: valor,
                        receita: receita,
                        data: hoje
                    });
                    await afiliado.save();
                    console.log(10);
                    await vendAfiliado.save();
                    console.log(11);
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

exports.addPagAfiliado = async function () {

}

exports.getAllPagAfiliado = async function () {

}