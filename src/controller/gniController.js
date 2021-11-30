const contaController = require('../model/Conta/Controller');
const instagramController = require('../model/Instagram/Controller');
const dadosController = require('../model/Dados/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const crypto = require('crypto');

//Controle de usuarios

exports.checkToken = async function (req, res, next) {
    let json = req.body;
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    let user = await contaController.findByToken(json.token);
    if (!user) return res.status(200).send({ statgus: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    dadosController.addAtivoPlat(json.token, 1);
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

//Controle das contas do Instagram

exports.createConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha da conta", data: [] });
    let listMobile = ["lg-optimus-g", "galaxy6", "galaxy-s5-gold", "lg-optimus-f6", "nexus-5x", "nexus5", "galaxy-s7-edge",
        "galaxy-s4", "nexus-6p", "note3", "nexus4-chroma", "xiaomi-mi-4w"];
    let insta = {
        "username": json.username,
        "password": json.password,
        "mobile": listMobile[Math.floor(Math.random() * (listMobile.length - 1))],
        "block": false,
        "challenge": false,
        "incorrect": false,
        "seguir": 0,
        "curtir": 0
    }
    let ret = await instagramController.adicionarConta(conta.token, insta);
    if (ret) {
        dadosController.addCadastroInsta();
        return res.status(200).send({ status: 1, erro: "", data: [insta] });
    }
    return res.status(200).send({ status: 0, erro: "Conta ja cadastrada", data: [] })
}

exports.alterarConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    if (!json.newpassword) return res.status(200).send({ status: 0, erro: "Informe a nova senha da conta", data: [] });
    let ret = await instagramController.alterarConta(conta.token, json.username, json.newpassword);
    if (ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel alterar a conta", data: [] });
}

exports.deletarConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let ret = await instagramController.removerConta(conta.token, json.username);
    if (ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Conta não encontrada", data: [] });
}

exports.getAllContas = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let ret = await instagramController.getAllContas(conta.token);
    if (!ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: ret })
}

exports.getContaByUsername = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    let ret = await instagramController.getContaByUsername(conta.token, json.username);
    return res.status(200).send({ status: 1, erro: "", data: [ret] })
}

exports.addChallenge = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.adicionarChallenge(conta.token, json.username);
    dadosController.addBloqueio(1, json.username);
    dadosController.addBloqueioPlat(1, json.username, 1);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeChallenge = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    var re = await instagramController.removerChallenge(conta.token, json.username);
    console.log(re);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addBlock = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.adicionarBlock(conta.token, json.username);
    dadosController.addBloqueio(0, json.username);
    dadosController.addBloqueioPlat(0, json.username, 1);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeBlock = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.removerBlock(conta.token, json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addIncorrect = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.adicionarIncorrect(conta.token, json.username);
    dadosController.addBloqueio(2, json.username);
    dadosController.addBloqueioPlat(2, json.username, 1);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeIncorrect = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.removerIncorrect(conta.token, json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addSeguir = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.adicionarSeguir(conta.token, json.username);
    dadosController.addTarefa(1);
    dadosController.addTarefaPat(1, 1);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addCurtir = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await instagramController.adicionarCurtir(conta.token, json.username);
    dadosController.addTarefa(2);
    dadosController.addTarefaPat(2, 1);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}