//Declarção das variaveis
const Conta = require('../model/conta');
const Licence = require('../model/licenca');
const Venda = require('../model/vendas');
const moment = require('moment');
const db = require('quick.db');

//Controles Administrador

exports.getAllUsers = async function (req, res, next) {
    let usuarios = await db.get(`arka.usuarios`);
    res.status(200).send(usuarios);
}

exports.deleteAllUsers = async function (req, res, next) {
    db.delete(`arka.usuarios`);
    res.status(200).send("Usuarios deletados");
}


//Controle de usuarios

exports.loginBot = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.email) return res.status(200).send({ status: 0, erro: "Informe o email de acesso ao sistema", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha de acesso ao sistema", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.loginAccount(json.email, json.password);
    if (!conta) return res.status(200).send({ status: 0, erro: "Email ou senha incorreto", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(conta.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [conta] });
}

exports.checkToken = async function (req, res, next) {
    let json = req.body;
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    let user = await db.get(`arka.usuarios.${json.token}`);
    if (!user) return res.status(200).send({ statgus: 0, erro: "Informe o token de acesso ao sistema", data: [] })
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.createAccount = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.email) return res.status(200).send({ status: 0, erro: "Informe o email para realizar a requisição", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha para realizar a requisição", data: [] });
    if (!json.rpassword) return res.status(200).send({ status: 0, erro: "Repita a senha para realizar a requisição", data: [] });
    if (json.password != json.rpassword) return res.status(200).send({ status: 0, erro: "As senhas não são iguais", data: [] });
    let u = Object.create(Conta);
    u = await u.createAccount(json.email, json.password, json.avata != null ? json.avatar : "");
    if (!u) return res.status(200).send({ status: 0, erro: "Esse email ja foi cadastrado", data: [] });
    return res.status(200).send({ status: 1, erro: "", data: [u] });
};


//Controle das contas do Instagram

exports.createConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    if (!json.password) return res.status(200).send({ status: 0, erro: "Informe a senha da conta", data: [] });
    let listMobile = ["lg-optimus-g", "nexus7gen2", "nexus7gen1", "htc10", "galaxy6", "galaxy-s5-gold", "lg-optimus-f6", "nexus-5x", "nexus5", "galaxy-s7-edge",
        "galaxy-s4", "nexus-6p", "galaxy-tab-s84", "galaxy-tab3", "note3", "nexus4-chroma", "sony-z3-compact", "xperia-z5", "honor-8lite", "xiaomi-mi-4w", "xiaomi-hm-1sw", "htc-one-plus"];
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
    let ret = await conta.adicionarConta(insta);
    if (ret) return res.status(200).send({ status: 1, erro: "", data: [insta] });
    return res.status(200).send({ status: 0, erro: "Conta ja cadastrada", data: [] })
}

exports.alterarConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    if (!json.newpassword) return res.status(200).send({ status: 0, erro: "Informe a nova senha da conta", data: [] });
    let ret = await conta.alterarConta(json.username, json.newpassword);
    if (ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel alterar a conta", data: [] });
}

exports.deletarConta = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let ret = await conta.removerConta(json.username);
    if (ret) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "Conta não encontrada", data: [] });
}

exports.getAllContas = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    let ret = await conta.getAllContas();
    return res.status(200).send({ status: 1, erro: "", data: ret })
}

exports.getContaByUsername = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    let ret = await conta.getContaByUsername(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [ret] })
}

exports.addChallenge = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.adicionarChallenge(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeChallenge = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.removerChallenge(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addBlock = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.adicionarBlock(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeBlock = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.removerBlock(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addIncorrect = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.adicionarIncorrect(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.removeIncorrect = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.removerIncorrect(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addSeguir = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.adicionarSeguir(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

exports.addCurtir = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.username) return res.status(200).send({ status: 0, erro: "Informe o username da conta", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "", data: [] });
    await conta.adicionarCurtir(json.username);
    return res.status(200).send({ status: 1, erro: "", data: [] });
}

//Controle dos grupos

exports.getAllGroups = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let grupo = await conta.getAllGrupo();
    if (grupo != null) return res.status(200).send({ status: 1, erro: "", data: grupo });
    return res.status(200).send({ status: 0, erro: "Grupo não encontrado", data: [] });
}

exports.getGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let grupo = await conta.getGrupoByName(json.nome);
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
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let grupo2 = {
        "global": json.global,
        "contas": json.contas,
        "nome": json.nome
    };
    let grupo = await conta.alterarGrupo(grupo2);
    if (grupo) return res.status(200).send({ status: 1, erro: "", data: [grupo2] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel cadastrar o grupo", data: [] });
}

exports.deleteGroup = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do grupo", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let grupo = await conta.removerGrupo(json.nome);
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
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let grupo2 = {
        "global": json.global,
        "contas": json.contas,
        "nome": json.nome
    };
    let grupo = await conta.adicionarGrupo(grupo2);
    if (grupo) return res.status(200).send({ status: 1, erro: "", data: [grupo2] });
    return res.status(200).send({ status: 0, erro: "Não foi possivel cadastrar o grupo", data: [] });
}

//Controle dos Globais

exports.getAllGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let global = await conta.getAllGlobal(json.nome);
    if (global != null) return res.status(200).send({ status: 1, erro: "", data: global });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.getGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do global", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let global = await conta.getGlobalByName(json.nome);
    if (global != null) return res.status(200).send({ status: 1, erro: "", data: [global] });
    return res.status(200).send({ status: 0, erro: "Global não encontrado", data: [] });
}

exports.deleteGlobal = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Envie os dados para realizar a requisição", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "Informe o token de acesso ao sistema", data: [] });
    if (!json.nome) return res.status(200).send({ status: 0, erro: "Informe o nome do global", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    let global = await conta.removeGlobalByName(json.nome);
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
    if (!json.cgrupo) return res.status(200).send({ status: 0, erro: "Erro Cadastro Grupo", data: [] });
    if (json.anonimo == null) return res.status(200).send({ status: 0, erro: "Erro Anonimo", data: [] });
    if (json.trocar == null) return res.status(200).send({ status: 0, erro: "Erro Trocar", data: [] });
    if (json.perfil == null) return res.status(200).send({ status: 0, erro: "Erro Perfil", data: [] });
    if (json.barra == null) return res.status(200).send({ status: 0, erro: "Erro Pesquisa", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
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
    let global = await conta.alterGlobal(g);
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
    if (!json.cgrupo) return res.status(200).send({ status: 0, erro: "Erro Cadastro Grupo", data: [] });
    if (json.anonimo == null) return res.status(200).send({ status: 0, erro: "Erro Anonimo", data: [] });
    if (json.trocar == null) return res.status(200).send({ status: 0, erro: "Erro Trocar", data: [] });
    if (json.perfil == null) return res.status(200).send({ status: 0, erro: "Erro Perfil", data: [] });
    if (json.barra == null) return res.status(200).send({ status: 0, erro: "Erro Barra", data: [] });
    let licence = Object.create(Licence);
    if (!await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 2, erro: "Licença expirada", data: [] });
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
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
    let global = await conta.createGlobal(g);
    if (global != null) return res.status(200).send({ status: 1, erro: "", data: [global] });
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
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return res.status(200).send({ status: 0, erro: "Token invalido", data: [] });
    let licence = Object.create(Licence);
    if (json.tipo == 1) {
        licence = await licence.adicionarLicenceInstagram(json.token, json.dias, json.origin);
        let venda = {
            "vendedor": json.vendedor,
            "origin": json.origin,
            "token": json.token,
            "valor": json.valor,
            "data": moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
            "nome": "Licença Instagram"
        };
        await Venda.adicionarVenda(venda);
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
    let conta = Object.create(Conta);
    conta = await conta.findByToken(json.token);
    if (!conta) return false;
    let licence = Object.create(Licence);
    if (json.tipo == 1) {
        licence = await licence.adicionarLicenceInstagram(json.token, json.dias, json.origin);
        let venda = {
            "vendedor": json.vendedor,
            "origin": json.origin,
            "token": json.token,
            "valor": json.valor,
            "data": moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
            "nome": "Licença Instagram"
        };
        await Venda.adicionarVenda(venda);
        return true;
    } else {
        return false;
    }
}

exports.validateLicence = async function (req, res, next) {
    let json = req.body;
    if (!json) return res.status(200).send({ status: 0, erro: "Erro", data: [] });
    if (!json.token) return res.status(200).send({ status: 0, erro: "", data: [] });
    let licence = Object.create(Licence);
    if (await licence.validateLicenceInstagram(json.token)) return res.status(200).send({ status: 1, erro: "", data: [] });
    return res.status(200).send({ status: 0, erro: "", data: [] });
}