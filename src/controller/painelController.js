//Declarção das variaveis
const moment = require('moment');
const contaController = require('../model/Conta/Controller');
const globalController = require('../model/Global/Controller');
const grupoController = require('../model/Grupo/Controller');
const instagramController = require('../model/Instagram/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const paymentController = require('../model/Payment/Controller');
const vendaController = require('../model/Venda/Controller');
const dadosController = require('../model/Dados/Controller');
const mongoose = require('mongoose');
const Conta = mongoose.model('Conta');
const Global = mongoose.model('Global');
const Grupo = mongoose.model('Grupo');
const Instagram = mongoose.model('Instagram');
const LicenseInsta = mongoose.model('LicenseInsta');
const Venda = mongoose.model('Venda');


//Controles do painel

exports.loadPainel = async function (req, res, next) {
    try {
        let user = req.user;
        let compras = await vendaController.getTokenVendas(user.token);
        let grupos = await grupoController.getAllGrupo(user.token);
        let instagram = await instagramController.getAllContas(user.token);
        let global = await globalController.getAllGlobal(user.token);
        let c = [];
        if (compras != null) {
            let lastIndex = compras.length - 1;
            for (let i = lastIndex; (i > (compras.length - 6)) && (i >= 0); i--) {
                c.push(compras[i]);
            }
        }
        let instaLicence = "Adquirida.";
        if (!await licenseController.validateLicenceInstagram(user.token))
            instaLicence = "Não adquirido.";
        return res.render('painel', { Insta: instagram != null ? instagram.length : 0, Grupos: grupos != null ? grupos.length : 0, Globais: global != null ? global.length : 0, Compras: c, instaLicence: instaLicence });
    } catch (err) {
        console.log(err)
        return res.render('login', { message: err.message });
    }
};

exports.loadInstagram = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('instagram', { Insta: [] });
    return res.render('instagram', { Insta: await instagramController.getAllContas(user.token) });
}

exports.loadGrupos = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('grupos', { Grupos: [] });
    return res.render('grupos', { Grupos: await grupoController.getAllGrupo(user.token) });
}

exports.loadGlobais = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.render('globais', { Globais: [] });
    return res.render('globais', { Globais: await globalController.getAllGlobal(user.token) });
}

exports.loadAdquirir = async function (req, res, next) {
    return res.render('adquirir', { message: "" });
}

exports.loadAdminPainel = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let contas = (await Conta.find()).length;
    let instas = (await Instagram.find()).length;
    let grupos = (await Grupo.find()).length;
    let globais = (await Global.find()).length;
    let vendas = (await Venda.find()).length;
    let linsta = (await LicenseInsta.find()).length;
    let t = await dadosController.getTarefasHoje();
    let tqtd = 0;
    if (t != null)
        tqtd = t.seguir + t.curtir;
    let cadcontas = await dadosController.getQtdCadastroHoje();
    let ativos = await dadosController.getAtivosHoje();
    let block = await dadosController.getBloqueiosHojeByTipo(0);
    let challenge = await dadosController.getBloqueiosHojeByTipo(1);
    let incorrect = await dadosController.getBloqueiosHojeByTipo(2);
    return res.render('paineladmin', { contas: contas, insta: instas, globais: globais, grupos: grupos, vendas: vendas, linsta: linsta, tarefas: tqtd, cadconta: cadcontas, ativos: ativos, block: block, challenge: challenge, incorrect: incorrect });
}

exports.loadAdminGniPainel = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let t = await dadosController.getTarefasHojePlat(1);
    let tqtd = 0;
    if (t != null)
        tqtd = t.seguir + t.curtir;
    let ativos = await dadosController.getAtivoshojePlat(1);
    let block = await dadosController.getBloqueiosHojeByTipoPlat(0, 1);
    let challenge = await dadosController.getBloqueiosHojeByTipoPlat(1, 1);
    let incorrect = await dadosController.getBloqueiosHojeByTipoPlat(2, 1);
    return res.render('paineladmingni', { tarefas: tqtd, ativos: ativos, block: block, challenge: challenge, incorrect: incorrect });
}

exports.loadAdminKzomPainel = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let t = await dadosController.getTarefasHojePlat(2);
    let tqtd = 0;
    if (t != null)
        tqtd = t.seguir + t.curtir;
    let ativos = await dadosController.getAtivoshojePlat(2);
    let block = await dadosController.getBloqueiosHojeByTipoPlat(0, 2);
    let challenge = await dadosController.getBloqueiosHojeByTipoPlat(1, 2);
    let incorrect = await dadosController.getBloqueiosHojeByTipoPlat(2, 2);
    return res.render('paineladminkzom', { tarefas: tqtd, ativos: ativos, block: block, challenge: challenge, incorrect: incorrect });
}

exports.loadAdminDizuPainel = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let t = await dadosController.getTarefasHojePlat(3);
    let tqtd = 0;
    if (t != null)
        tqtd = t.seguir + t.curtir;
    let ativos = await dadosController.getAtivoshojePlat(3);
    let block = await dadosController.getBloqueiosHojeByTipoPlat(0, 3);
    let challenge = await dadosController.getBloqueiosHojeByTipoPlat(1, 3);
    let incorrect = await dadosController.getBloqueiosHojeByTipoPlat(2, 3);
    return res.render('paineladmindizu', { tarefas: tqtd, ativos: ativos, block: block, challenge: challenge, incorrect: incorrect });
}

exports.loadAdminReportAllDaysActive = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let list = await dadosController.getAllDaysActiveList();
    list.reverse();
    return res.render('paineladminlistalldaysativo', { list: list });
}

exports.loadTaskReport = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let list = await dadosController.getAllDaysTaskList();
    list.reverse();
    return res.render('paineladminlistalltask', { list: list });
}

exports.loadBlockReport = async function (req, res, next) {
    let user = req.user;
    if (!user) return res.redirect('/');
    if (user.token != "01ea3579fc706551a0ccff5cb2844f55" && user.token != "29cae7e3579b034d3ead6b8ed9e93e45") return res.redirect('/');
    let list = await dadosController.getAllDaysBlock();
    list.reverse();
    return res.render('paineladminlistallblock', { list: list });
}