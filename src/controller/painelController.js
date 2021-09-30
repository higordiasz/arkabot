//Declarção das variaveis
const Conta = require('../model/conta');
const Licence = require('../model/licenca');
const Venda = require('../model/vendas');
const moment = require('moment');
const db = require('quick.db');

//Controles do painel

exports.loadPainel = async function (req, res, next) {
    try {
        let user = req.user;
        let compras = await Venda.getTokenVendas(user.token);
        let c = [];
        if (compras != null) {
            let lastIndex = compras.length - 1;
            for (let i = lastIndex; (i > (compras.length - 6)) && (i >= 0); i--) {
                c.push(compras[i]);
            }
        }
        let licence = Object.create(Licence);
        let instaLicence = "Adquirida.";
        if (!await licence.validateLicenceInstagram(user.token))
            instaLicence = "Não adquirido.";
        return res.render('painel', { Insta: user.contas.length, Grupos: user.grupos.length, Globais: user.globals.length, Compras: c , instaLicence: instaLicence});
    } catch (err) {
        console.log(err)
        return res.render('/login', { message: err.message });
    }
};

exports.loadInstagram = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('instagram', { Insta: []});
    return res.render('instagram', { Insta: user.contas});
}

exports.loadGrupos = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('grupos', { Grupos: []});
    return res.render('grupos', { Grupos: user.grupos});
}

exports.loadGlobais = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('globais', { Globais: []});
    return res.render('globais', { Globais: user.globals});
}

exports.loadAdquirir = async function (req, res, next) {
    return res.render ('adquirir', {message: ""});
}