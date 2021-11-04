//Declarção das variaveis
const contaController = require('../model/Conta/Controller');
const globalController = require('../model/Global/Controller');
const grupoController = require('../model/Grupo/Controller');
const instagramController = require('../model/Instagram/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const paymentController = require('../model/Payment/Controller');
const vendaController = require('../model/Venda/Controller');
const moment = require('moment');
const useragentFromSeed = require('useragent-from-seed');
const dadosController = require('../model/Dados/Controller');

//Controles Administrador
/*
exports.getAllUsers = async function (req, res, next) {
    let usuarios = await db.get(`arka.usuarios`);
    res.status(200).send(usuarios);
}

exports.deleteAllUsers = async function (req, res, next) {
    db.delete(`arka.usuarios`);
    res.status(200).send("Usuarios deletados");
}
*/

//Controle de usuarios

exports.loginBot = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.email) return res.status(200).send({ status: 0, erro: "Informe o email de acesso ao sistema", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha de acesso ao sistema", data: [] });
    let conta = await contaController.loginAccount(json.email, json.password);
    if (!conta) return res.status(200).send({ status: 0, erro: "Email ou senha incorreto", data: [] });
    //if (!await licenseController.validateLicenceInstagram(conta.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    dadosController.addAtivo(conta.token);
    return res.status(200).send({ status: 1, erro: "", data: [conta] });
}

exports.checkToken = async function (req, res, next) {
    let json = req.body;
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    let user = await contaController.findByToken(json.token);
    if (!user) return res.status(200).send({ statgus: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.createAccount = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.email) return res.status(200).send({ status: 0, erro: "Informe o email para realizar a requisição", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha para realizar a requisição", data: [] });
    if (!json.rpassword) return res.status(200).send({ status: 0, erro: "Repita a senha para realizar a requisição", data: [] });
    if (json.password != json.rpassword) return res.status(200).send({ status: 0, erro: "As senhas não são iguais", data: [] });
    let u = await contaController.createAccount(json.email, json.password, json.avatar != null ? json.avatar : "");
    if (!u) return res.status(200).send({ status: 0, erro: "Esse email ja foi cadastrado", data: [] });
    dadosController.addCadastro();
    return res.status(200).send({ status: 1, erro: "", data: [u] });
};


//Controle das contas do Instagram

exports.createConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
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
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
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
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
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
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let ret = await instagramController.getAllContas(conta.token);
    if (!ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: ret })
}

exports.getContaByUsername = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
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
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

//Controle dos grupos

exports.getAllGroups = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let grupo = await grupoController.getAllGrupo(conta.token);
    if (grupo != null) return res.status(200).send({ status: 1, erro: "", data: grupo });
    return res.status(200).send({ status: 0, erro: "Grupo não encontrado", data: [] });
}

exports.getGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let grupo = await grupoController.getGrupoByName(conta.token, json.nome);
    if (grupo != null) return res.status(200).send({ status: 1, erro: "", data: [grupo] });
    return res.status(200).send({ status: 0, erro: "Grupo não encontrado", data: [] });
}

exports.alterGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    if (!json.global) return res.status(200).send({ status: 0, erro: "Informe o nome do Global", data: [] });
    if (!json.contas) return res.status(200).send({ status: 0, erro: "Informe as contas", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let grupo2 = {
        "global": json.global,
        "contas": json.contas,
        "nome": json.nome
    };
    let grupo = await grupoController.alterarGrupo(conta.token, json.nome, grupo2);
    if (grupo) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel cadastrar o grupo", data: [] });
}

exports.deleteGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let grupo = await grupoController.removerGrupo(conta.token, json.nome);
    if (grupo) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Grupo não encontrado", data: [] });
}

exports.createGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    if (!json.global) return res.status(200).send({ status: 0, erro: "Informe o nome do Global", data: [] });
    if (!json.contas) return res.status(200).send({ status: 0, erro: "Informe as contas", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let grupo2 = {
        "global": json.global,
        "contas": json.contas,
        "nome": json.nome
    };
    let grupo = await grupoController.adicionarGrupo(conta.token, grupo2);
    if (grupo) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel cadastrar o grupo", data: [] });
}

//Controle dos Globais

exports.getAllGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let global = await globalController.getAllGlobal(conta.token);
    if (global != null) return res.status(200).send({ status: 1, erro: "", data: global });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.getGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do global", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let global = await globalController.getGlobalByName(conta.token, json.nome);
    if (global != null) return res.status(200).send({ status: 1, erro: "", data: [global] });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.deleteGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do global", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let global = await globalController.removeGlobalByName(conta.token, json.nome);
    if (global) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.AlterGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Erro Nome", data: [] });
    if (!json.delay1) return res.status(200).send({ status: 0, erro: "Erro Delay1", data: [] });
    if (!json.delay2) return res.status(200).send({ status: 0, erro: "Erro Delay2", data: [] });
    if (!json.quantidade) return res.status(200).send({ status: 0, erro: "Erro Quantidade", data: [] });
    if (!json.tcontas) return res.status(200).send({ status: 0, erro: "Erro Tempo entre COntas", data: [] });
    if (!json.meta) return res.status(200).send({ status: 0, erro: "Erro Meta", data: [] });
    if (!json.tmeta) return res.status(200).send({ status: 0, erro: "Erro Tempo após Meta", data: [] });
    if (!json.tblock) return res.status(200).send({ status: 0, erro: "Erro Tempo de Block", data: [] });
    if (json.cgrupo == null) return res.status(200).send({ status: 0, erro: "Erro Cadastro Grupo", data: [] });
    if (json.anonimo == null) return res.status(200).send({ status: 0, erro: "Erro Anonimo", data: [] });
    if (json.trocar == null) return res.status(200).send({ status: 0, erro: "Erro Trocar", data: [] });
    if (json.perfil == null) return res.status(200).send({ status: 0, erro: "Erro Perfil", data: [] });
    if (json.barra == null) return res.status(200).send({ status: 0, erro: "Erro Pesquisa", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let g = {
        "nome": json.nome,
        "delay1": json.delay1,
        "delay2": json.delay2,
        "quantidade": json.quantidade,
        "tcontas": json.tcontas,
        "meta": json.meta,
        "tmeta": json.tmeta,
        "tblock": json.tblock,
        "cgrupo": json.cgrupo,
        "anonimo": json.anonimo,
        "trocar": json.trocar,
        "perfil": json.perfil,
        "barra": json.barra
    };
    let global = await globalController.alterGlobal(conta.token, json.nome, g);
    if (global) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.createGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Erro Nome", data: [] });
    if (!json.delay1) return res.status(200).send({ status: 0, erro: "Erro Delay1", data: [] });
    if (!json.delay2) return res.status(200).send({ status: 0, erro: "Erro Delay2", data: [] });
    if (!json.quantidade) return res.status(200).send({ status: 0, erro: "Erro Quantidade", data: [] });
    if (!json.tcontas) return res.status(200).send({ status: 0, erro: "Erro Trocar de Contas", data: [] });
    if (!json.meta) return res.status(200).send({ status: 0, erro: "Erro Meta", data: [] });
    if (!json.tmeta) return res.status(200).send({ status: 0, erro: "Erro Tempo Meta", data: [] });
    if (!json.tblock) return res.status(200).send({ status: 0, erro: "Erro Tempo Block", data: [] });
    if (!json.tblock) return res.status(200).send({ status: 0, erro: "Erro Tempo Block", data: [] });
    if (json.cgrupo == null) return res.status(200).send({ status: 0, erro: "Erro Cadastro Grupo", data: [] });
    if (json.anonimo == null) return res.status(200).send({ status: 0, erro: "Erro Anonimo", data: [] });
    if (json.trocar == null) return res.status(200).send({ status: 0, erro: "Erro Trocar", data: [] });
    if (json.perfil == null) return res.status(200).send({ status: 0, erro: "Erro Perfil", data: [] });
    if (json.barra == null) return res.status(200).send({ status: 0, erro: "Erro Barra", data: [] });
    //if (!await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Usuario n encontrado", data: [] });
    let g = {
        "nome": json.nome,
        "delay1": json.delay1,
        "delay2": json.delay2,
        "quantidade": json.quantidade,
        "tcontas": json.tcontas,
        "meta": json.meta,
        "tmeta": json.tmeta,
        "tblock": json.tblock,
        "cgrupo": json.cgrupo,
        "anonimo": json.anonimo,
        "trocar": json.trocar,
        "perfil": json.perfil,
        "barra": json.barra
    };
    let global = await globalController.createGlobal(conta.token, g);
    if (global) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Nome do Global ja cadastrado", data: [] });
}

//Controle de licenças do Arka

exports.addLicence = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (!json.usernameadmin) return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (!json.passadmin) return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (json.usernameadmin != "arkagroup.senha$do%painel&admin@nesse$programa()topDEMAIS123") return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (json.passadmin != "adijfikbn234539487ksfdjhgbsfkjbh@##$fivsbngdifjgnb$#@$#ovjnbvdjlbndgojbn()dgkvdfgjbndgj()fjghdfgj@#$fjubngdSKFGBFOF#@@#OFJBNFKJBNFJBN") return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.dias) return res.status(200).send({ status: 0, erro: "Informe os dias de acesso ao sistema", data: [] });
    if (!json.origin) return res.status(200).send({ status: 0, erro: "Informe a origin da transação", data: [] });
    if (!json.vendedor) return res.status(200).send({ status: 0, erro: "Informe o vendedor da transação", data: [] });
    if (!json.valor) return res.status(200).send({ status: 0, erro: "Informe o valor da transação", data: [] });
    if (!json.tipo) return res.status(200).send({ status: 0, erro: "Informe o tipo da licença", data: [] });
    let conta = await contaController.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (json.tipo == 1) {
        licence = await licenseController.adicionarLicenceInstagram(json.token, json.dias, json.origin);
        let venda = {
            "vendedor": json.vendedor,
            "origin": json.origin,
            "token": json.token,
            "valor": json.valor,
            "data": moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
            "nome": "Licença Instagram"
        };
        await vendaController.adicionarVenda(venda);
        return res.status(200).send({ status: 1, erro: "", data: [licence] });
    } else {
        return res.status(400).send({ status: 1, erro: "", data: [licence] });
    }
}

exports.addLicenceSite = async function (json) {
    if (!json) return false;
    if (!json.token) return false;
    if (!json.dias) return false;
    if (!json.origin) return false;
    if (!json.vendedor) return false;
    if (!json.valor) return false;
    if (!json.tipo) return false;
    let conta = await contaController.findByToken(json.token);
    if (!conta) return false;
    if (json.tipo == 1) {
        let licence = await licenseController.adicionarLicenceInstagram(json.token, json.dias, json.origin);
        let venda = {
            "vendedor": json.vendedor,
            "origin": json.origin,
            "token": json.token,
            "valor": json.valor,
            "data": moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
            "nome": "Licença Instagram"
        };
        await vendaController.adicionarVenda(venda);
        return true;
    } else {
        return false;
    }
}

exports.validateLicence = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "", data: [] });
    //if (await licenseController.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.getUserAgentFromSeed = async function (req, res, next) {
    let json = req.body;
    if(!json) return res.status(200).send({status: 0, erro: ""});
    if(!json.username) return res.status(200).send({status: 0, erro: ""});
    return res.status(200).send({status: 1, erro: useragentFromSeed(json.username)});
}