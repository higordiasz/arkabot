const LocalStrategy = require('passport-local').Strategy;
const contaController = require('../model/Conta/Controller');
const globalController = require('../model/Global/Controller');
const grupoController = require('../model/Grupo/Controller');
const instagramController = require('../model/Instagram/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const paymentController = require('../model/Payment/Controller');
const vendaController = require('../model/Venda/Controller');
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

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            let user = await contaController.findByEmail(email);
            if (user != null) {
                let md5Passwrod = md5(password);
                if (md5Passwrod == user.password) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Email ou senha errado' });
                }
            } else {
                return done(null, false, { message: 'Email ou senha errado' });
            }
        })
    );
    passport.serializeUser(function (user, done) {
        done(null, user.token);
    });
    passport.deserializeUser(async function (id, done) {
        if (await contaController.findByToken(id) != null) {
            return done(null, await contaController.findByToken(id))
        } else {
            return done(null, null)
        }
    });
};