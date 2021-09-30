const LocalStrategy = require('passport-local').Strategy;
const db = require('quick.db');
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
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            let e = email.ReplaceAll(".", "-").ReplaceAll(" ", "").toLowerCase();
            let token = md5('arkatokengenerate' + e + password);
            let conta = db.get(`arka.usuarios.${token}`)
            if (conta != null) {
                let md5Passwrod = md5(password);
                if (md5Passwrod == conta.password) {
                    return done(null, conta);
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

    passport.deserializeUser(function (id, done) {
        if (db.get(`arka.usuarios.${id}`) != null) {
            done(null, db.get(`arka.usuarios.${id}`))
        } else {
            done(null, null)
        }
    });
};