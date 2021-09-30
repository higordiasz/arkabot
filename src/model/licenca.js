const db = require('quick.db');
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

var Licenca = new Object({
    token: "",
    aquisicao: "",
    final: "",
    origin: "",
    validateLicenceInstagram: async function (token) {
        let licence = await db.get(`arka.licence.instagram.${token}`);
        if (!licence) return false;
        let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
        let final = moment(licence.final, "DD/MM/YYYY HH:mm:ss");
        if (hoje.isAfter(final, 'hours')) return false;
        return true;
    },
    adicionarLicenceInstagram: async function (token, dias, origin) {
        let licence = await db.get(`arka.licence.instagram.${token}`);
        if (!licence) {
            let json = {
                "token": token,
                "aquisicao": moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                "final": moment().add(dias, 'days').format("DD/MM/YYYY HH:mm:ss"),
                "origin": origin
            };
            await db.set(`arka.licence.instagram.${token}`, json);
            this.token = json.token
            this.aquisicao = json.aquisicao
            this.final = json.final
            this.origin = json.origin
            return this;
        } else {
            let hoje = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
            let final = moment(licence.final, "DD/MM/YYYY HH:mm:ss");
            if (hoje.isAfter(final, 'hours')) {
                let json = {
                    "token": token,
                    "aquisicao": hoje.format("DD/MM/YYYY HH:mm:ss").toString(),
                    "final": moment().add(dias, 'days').format("DD/MM/YYYY HH:mm:ss"),
                    "origin": origin
                };
                console.log(json)
                await db.set(`arka.licence.instagram.${token}`, json);
                this.token = json.token
                this.aquisicao = json.aquisicao
                this.final = json.final
                this.origin = json.origin
                return this;
            } else {
                licence.origin = origin;
                licence.aquisicao = hoje.format("DD/MM/YYYY HH:mm:ss").toString();
                let hours = final.diff(hoje, 'hours') + 1;
                licence.final = moment().add(hours, 'hours').add(dias, 'days').format("DD/MM/YYYY HH:mm:ss");
                await db.set(`arka.licence.instagram.${token}`, licence);
                this.token = licence.token
                this.aquisicao = licence.aquisicao
                this.final = licence.final
                this.origin = licence.origin
                return this;
            }
        }
    }
})

module.exports = Licenca;