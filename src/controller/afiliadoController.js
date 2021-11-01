//Declarção das variaveis
const contaController = require('../model/Conta/Controller');
const globalController = require('../model/Global/Controller');
const grupoController = require('../model/Grupo/Controller');
const instagramController = require('../model/Instagram/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const paymentController = require('../model/Payment/Controller');
const vendaController = require('../model/Venda/Controller');
const afiliadoController = require('../model/Afiliados/Controller');
const moment = require('moment');
const useragentFromSeed = require('useragent-from-seed');

exports.loadPageAfiliadoByCode = async function (req, res, next) {
    try {
        let json = req.query;
        if (!json) return res.redirect('/');
        if (!json.code) return res.redirect('/');
        let afiliado = await afiliadoController.getAfiliadoByCode(json.code);
        if (afiliado != null) {
            let user = req.user;
            if (!user) return res.redirect('/');;
            if (!user.token) return res.redirect('/');
            if (afiliado.token != user.token) return res.redirect('/');
            let qtd = await afiliadoController.getAllCadAfiliadoByCodeAfiliado(afiliado.code);
            return res.render('afiliado', { token: afiliado.token, code: afiliado.code, receita: afiliado.receita, qtd: qtd.length, afiliados: qtd })
        }
        return res.redirect('/');
    } catch (err) {
        console.log(err)
        return res.redirect('/');
    }
}

exports.createAfiliado = async function (req, res, next) {
    try {
        let json = req.body;
        if (!json.password) return res.status(200).send({ status: 0, erro: "Erro" });
        if (!json.admin) return res.status(200).send({ status: 0, erro: "Erro" });
        if (!json.token) return res.status(200).send({ status: 0, erro: "Erro" });
        if (!json.code) return res.status(200).send({ status: 0, erro: "Erro" });
        if (!json.email) return res.status(200).send({ status: 0, erro: "Erro" });
        if (json.password != "PasSwoRdArKaAfIlIADO!@#123$%^^456@@2021") return res.status(200).send({ status: 0, erro: "Erro" });
        if (json.admin != "AdministradorArkaBot@2021.NewBotYear") return res.status(200).send({ status: 0, erro: "Erro" });
        let af = {
            email: json.email,
            token: json.token,
            code: json.code
        };
        let create = await afiliadoController.addAfiliado(af);
        if (create) return res.status(200).send({ status: 1, erro: "Sucesso" });
        return res.status(200).send({ status: 0, erro: "Erro ao criar" });
    } catch {
        res.status(200).send({ status: 0, erro: "Erro" });
    }
}

exports.createCadAfiliado = async function (req, res, next) {
    try {
        let json = req.body;
        if (!json) return res.render('cadafiliado', { message: "Erro", code: "arka" });
        if (!json.code) return res.render('cadafiliado', { message: "Código invalido", code: "arka" });
        if (!json.email) return res.render('cadafiliado', { message: "Informe o email para realizar o cadastro", code: json.code });
        if (!json.password) return res.render('cadafiliado', { message: "Informe a senha para realizar o registro", code: json.code });
        if (!json.rpassword) return res.render('cadafiliado', { message: "Repita a senha para realizar o registro", code: json.code });
        if (json.password != json.rpassword) return res.render('cadafiliado', { message: "As senhas não são iguais", code: json.code });
        let u = await contaController.createAccount(json.email, json.password, json.avatar != null ? json.avatar : "nenhum");
        if (!u) return res.render('cadafiliado', { message: "Email ja cadastrado", code: json.code });
        let cad = {
            token_cadastrado: u.token,
            email: u.email
        };
        let r = await afiliadoController.addCadAfiliadoByCodeAfiliado(cad, json.code);
        return res.redirect('../login');
    } catch {
        return res.render('cadafiliado', { message: "Código invalido", code: "arka" });
    }
}