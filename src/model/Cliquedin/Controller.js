const mongoose = require('mongoose');
const CliquedinLicense = mongoose.model('CliquedinLicense');
const CliquedinLogin = mongoose.model('CliquedinLogin');
const CliquedinOpen = mongoose.model('CliquedinOpen');
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

exports.validateLicenceCliquedin = async function (token) {
    if (token.isNullOrEmpty()) return false;
    let l = await CliquedinLicense.findOne({ token: token })
    if (!l) return false;
    let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let final = moment(l.final, "DD/MM/YYYY HH:mm:ss");
    if (hoje.isAfter(final, 'hours')) return false;
    return true;
}

exports.getFinalLicenceCliquedin = async function (token) {
    if (token.isNullOrEmpty()) return "";
    let l = await CliquedinLicense.findOne({ token: token })
    if (!l) return "";
    let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let final = moment(l.final, "DD/MM/YYYY HH:mm:ss");
    if (hoje.isAfter(final, 'hours')) return "";
    return final.format("DD/MM/YYYY HH:mm:ss");
}

exports.adicionarLicenceCliquedin = async function (token, dias, origin) {
    if (token.isNullOrEmpty()) return false;
    if (origin.isNullOrEmpty()) return false;
    let licence = await CliquedinLicense.findOne({ token: token });
    if (!licence) {
        let json = new CliquedinLicense({
            token: token,
            aquisicao: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
            final: moment().add(dias, 'days').format("DD/MM/YYYY HH:mm:ss"),
            origin: origin
        });
        await json.save();
        return true;
    } else {
        let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
        let final = moment(licence.final, "DD/MM/YYYY HH:mm:ss");
        if (hoje.isAfter(final, 'hours')) {
            licence.aquisicao = moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                licence.final = moment().add(dias, 'days').format("DD/MM/YYYY HH:mm:ss"),
                licence.origin = origin
            await licence.save();
            return true;
        } else {
            licence.origin = origin;
            licence.aquisicao = hoje.format("DD/MM/YYYY HH:mm:ss").toString();
            let hours = final.diff(hoje, 'hours') + 1;
            licence.final = moment().add(hours, 'hours').add(dias, 'days').format("DD/MM/YYYY HH:mm:ss");
            await licence.save();
            return true;
        }
    }
}

exports.saveLogin = async function (token, crypted, auth) {
    if (token.isNullOrEmpty()) return false;
    if (crypted.isNullOrEmpty()) return false;
    if (auth.isNullOrEmpty()) return false;
    var l = await CliquedinLogin.findOne({ autenticador: auth });
    if (!l) {

    } else {

    }
}

exports.loadLogin = async function (token, crypted) {

}

exports.addOpen = async function () {
    try {
        let hoje = moment(new Date()).format("DD/MM/YYYY");
        let have = await CliquedinOpen.findOne({ data: hoje });
        if (have) {
            have.qtd += 1;
            await have.save();
        } else {
            let novo = new CliquedinOpen({
                data: hoje,
                qtd: 1
            });
            await novo.save();
        }
        return 'Adicionado';
    } catch (err) {
        return `${err}`;
    }
}