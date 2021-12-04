const mongoose = require('mongoose');
const LicenseInsta = mongoose.model('LicenseInsta');
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

exports.validateLicenceInstagram = async function (token) {
    if (token.isNullOrEmpty()) return false;
    let l = await LicenseInsta.findOne({ token: token })
    if (!l) return false;
    let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let final = moment(l.final, "DD/MM/YYYY HH:mm:ss");
    if (hoje.isAfter(final, 'hours')) return false;
    return true;
}

exports.getFinalLicenceInstagram = async function (token) {
    if (token.isNullOrEmpty()) return "";
    let l = await LicenseInsta.findOne({ token: token })
    if (!l) return "";
    let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
    let final = moment(l.final, "DD/MM/YYYY HH:mm:ss");
    if (hoje.isAfter(final, 'hours')) return "";
    return final.format("DD/MM/YYYY HH:mm:ss");
}

exports.adicionarLicenceInstagram = async function (token, dias, origin) {
    if (token.isNullOrEmpty()) return false;
    if (origin.isNullOrEmpty()) return false;
    let licence = await LicenseInsta.findOne({token: token});
    if (!licence) {
        let json = new LicenseInsta({
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