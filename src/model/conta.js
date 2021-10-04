/*const db = require('quick.db');
const md5 = require('md5');
const { normalizeUnits } = require('moment');

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

var Conta = new Object({
    email: "",
    password: "",
    token: "",
    avatar: "",
    contas: [],
    grupos: [],
    globals: [],
    findByEmail: async function (email) {
        let e = email.ReplaceAll(" ", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios`);
        if (contas == null) return null;
        let jsonString = JSON.stringify(contas);
        let conta = JSON.parse(jsonString);
        for (var c in conta) {
            if (e == conta[c].email) {
                this.email = conta[c].email
                this.password = conta[c].password
                this.token = conta[c].token
                this.avatar = conta[c].avatar
                this.contas = conta[c].contas
                this.grupos = contas[c].grupos
                this.globals = contas[c].globals
                return this;
            }
        }
        return null;
    },
    findByToken: async function (token) {
        let t = token.ReplaceAll(" ", "").toLowerCase();
        let user = await db.get(`arka.usuarios.${t}`);
        if (!user) return null;
        this.email = user.email
        this.password = user.password
        this.token = user.token
        this.avatar = user.avatar
        this.contas = user.contas
        this.grupos = user.grupos
        this.globals = user.globals
        return this;
    },
    loginAccount: async function (email, password) {
        let e = email.ReplaceAll(".", "-").ReplaceAll(" ", "").toLowerCase();
        let senha = md5(password)
        let token = md5('arkatokengenerate' + e + password);
        let conta = await db.get(`arka.usuarios.${token}`)
        if(!conta) return null;
        let ret = {
            "email": conta.email,
            "password": senha,
            "token": conta.token,
            "avatar": conta.avatar
        };
        return ret;
    },
    createAccount: async function (email, password, avatar = "") {
        let e = email.ReplaceAll(".", "-").ReplaceAll(" ", "").toLowerCase();
        if (await this.findByEmail(e) != null) return null;
        let token = md5('arkatokengenerate' + e + password);
        let senha = md5(password)
        let user = {
            "email": e,
            "password": senha,
            "token": token,
            "avatar": avatar,
            "contas": [],
            "grupos": [],
            "globals": []
        };
        await db.set(`arka.usuarios.${token}`, user);
        let ret = Object.create(Conta);
        ret.email = e;
        ret.password = password;
        ret.token = token;
        ret.avatar = avatar;
        return ret;
    },
    alterAvatar: async function (url) {
        if (this.token == "") return false;
        this.avatar = url;
        await db.set(`arka.usuarios.${this.token}.avatar`, url);
        return true;
    },
    alterPassword: async function (pass) {
        if (this.token == "") return false;
        let senha = md5(pass)
        this.password = senha;
        await db.set(`arka.usuarios.${this.token}.password`, pass);
        return true;
    },
    adicionarConta: async function (conta) {
        if (conta.username.isNullOrEmpty()) return false;
        let username = conta.username.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase().ReplaceAll(".", "-");
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.contas`) == null) return false;
        if (conta.password.isNullOrEmpty()) return false;
        if (conta.mobile.isNullOrEmpty()) return false;
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == username) return false;
        }
        let contaToSave = {
            "username": username,
            "password": conta.password,
            "mobile": conta.mobile,
            "block": conta.block,
            "challenge": conta.challenge,
            "incorrect": conta.incorrect,
            "seguir": conta.seguir,
            "curtir": conta.curtir
        }
        db.push(`arka.usuarios.${this.token}.contas`, contaToSave);
        return true;
    },
    removerConta: async function (username) {
        if (username.isNullOrEmpty()) return false;
        let name = username.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase().ReplaceAll(".", "-");
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.contas`) == null) return false;
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        console.log(contas)
        console.log(name)
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username != name) {
                aux.push(contas[i]);
            }
        }
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        let auxGrupos = [];
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].contas.includes(name)) {
                if (grupos[i].contas.length > 1) {
                    let auxContas = [];
                    for (let j = 0; j < grupos[i].contas.length; j++) {
                        if (grupos[i].contas[j] != name) {
                            auxContas.push(grupos[i].contas[j]);
                        }
                    }
                    grupos[i].contas = auxContas;
                    auxGrupos.push(grupos[i]);
                }
            } else {
                auxGrupos.push(grupos[i]);
            }
        }
        db.set(`arka.usuarios.${this.token}.contas`, aux);
        db.set(`arka.usuarios.${this.token}.grupos`, auxGrupos);
        return true;
    },
    alterarConta: async function (username, newPassword) {
        if (username.isNullOrEmpty()) return false;
        if (newPassword.isNullOrEmpty()) return false;
        let name = username.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase().ReplaceAll(".", "-");
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.contas`) == null) return false;
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == name) {
                contas[i].password = newPassword;
            };
        }
        await db.set(`arka.usuarios.${this.token}.contas`, contas);
        return true;
    },
    getContaByUsername: async function (username) {
        if (username.isNullOrEmpty()) return null;
        let name = username.ReplaceAll("-", "").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase().ReplaceAll(".", "-");
        if(this.token == "" || this.token == null) return null;
        if(await db.get(`arka.usuarios.${this.token}.contas`) == null) return null;
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == name) {
                contas[i].username = contas[i].username.ReplaceAll("-", ".");
                return contas[i];
            };
        }
        return null;
    },
    getAllContas: async function () {
        if(this.token == "" || this.token == null) return null;
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        for (let i = 0; i < contas.length; i++) {
            contas[i].username = contas[i].username.ReplaceAll("-", ".");
        }
        return contas;
    },
    adicionarBlock: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].block = true;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    removerBlock: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].block = false;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    adicionarChallenge: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].challenge = true;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    removerChallenge: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].challenge = false;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    adicionarIncorrect: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].incorrect = true;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    removerIncorrect: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].incorrect = false;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    adicionarSeguir: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].seguir += 1;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    adicionarCurtir: async function (conta) {
        if(this.token == "" || this.token == null) return false;
        if(conta.isNullOrEmpty()) return false;
        let nome = conta.ReplaceAll("-", ".").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").ReplaceAll(".", "-").toLowerCase();
        let contas = await db.get(`arka.usuarios.${this.token}.contas`);
        let aux = [];
        for (let i = 0; i < contas.length; i++) {
            if (contas[i].username == nome) contas[i].curtir += 1;
            aux.push(contas[i]);
        }
        await db.set(`arka.usuarios.${this.token}.contas`, aux);
        return true;
    },
    adicionarGrupo: async function (grupo) {
        if (grupo.nome.isNullOrEmpty()) return false;
        let nome = grupo.nome.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.grupos`) == null) return false;
        if(grupo.global.isNullOrEmpty()) return false;
        if(!grupo.contas) return false;
        if(!grupo.contas.length) return false;
        if(grupo.contas.length < 1) return false;
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].nome == nome) return false;
        }
        grupo.nome = nome;
        db.push(`arka.usuarios.${this.token}.grupos`, grupo);
        return true;
    },
    alterarGrupo: async function (grupo) {
        if (grupo.nome.isNullOrEmpty()) return false;
        let nome = grupo.nome.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.grupos`) == null) return false;
        if(grupo.global.isNullOrEmpty()) return false;
        if(!grupo.contas) return false;
        if(!grupo.contas.length) return false;
        if(grupo.contas.length < 1) return false;
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        let aux = [];
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].nome != nome) aux.push(grupos[i]);
        }
        grupo.nome = nome;
        aux.push(grupo);
        db.set(`arka.usuarios.${this.token}.grupos`, aux);
        return true;
    },
    removerGrupo: async function (nome2) {
        if (nome2.isNullOrEmpty()) return false;
        let nome = nome2.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        if(this.token == "" || this.token == null) return false;
        if(await db.get(`arka.usuarios.${this.token}.grupos`) == null) return false;
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        let aux = [];
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i].nome != nome) aux.push(grupos[i]);
        }
        db.set(`arka.usuarios.${this.token}.grupos`, aux);
        return true;
    },
    getGrupoByName: async function (nome2) {
        if (nome2.isNullOrEmpty()) return null;
        let nome = nome2.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        if(this.token == "" || this.token == null) return null;
        if(await db.get(`arka.usuarios.${this.token}.grupos`) == null) return null;
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        console.log(nome);
        for (let i = 0; i < grupos.length; i++) {
            console.log(grupos[i].nome)
            if (grupos[i].nome == nome) return grupos[i];
        }
        return null;
    },
    getAllGrupo: async function () {
        if(this.token == "" || this.token == null) return null;
        return await db.get(`arka.usuarios.${this.token}.grupos`);
    },
    createGlobal: async function (global) {
        if (this.token.isNullOrEmpty()) return null;
        if (global.nome.isNullOrEmpty()) return null;
        if (global.delay1.toString().isNullOrEmpty()) return null;
        if (global.delay2.toString().isNullOrEmpty()) return null;
        if (global.quantidade.toString().isNullOrEmpty()) return null;
        if (global.tcontas.toString().isNullOrEmpty()) return null;
        if (global.meta.toString().isNullOrEmpty()) return null;
        if (global.tmeta.toString().isNullOrEmpty()) return null;
        if (global.tblock.toString().isNullOrEmpty()) return null;
        if (global.cgrupo.toString().isNullOrEmpty()) return null;
        if (global.anonimo.toString().isNullOrEmpty()) return null;
        if (global.trocar.toString().isNullOrEmpty()) return null;
        if (global.perfil.toString().isNullOrEmpty()) return null;
        if (global.barra.toString().isNullOrEmpty()) return null;
        let nome = global.nome.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        let globais = await db.get(`arka.usuarios.${this.token}.globals`);
        if (!globais) return null;
        for (let i = 0; i < globais.length; i++) {
            if (globais[i].nome == nome) return null;
        }
        global.nome = nome;
        db.push(`arka.usuarios.${this.token}.globals`, global);
        return global;
    },
    alterGlobal: async function (novo) {
        if (this.token.isNullOrEmpty()) return false;
        if (novo.nome.isNullOrEmpty()) return false;
        if (novo.delay1.toString().isNullOrEmpty()) return false;
        if (novo.delay2.toString().isNullOrEmpty()) return false;
        if (novo.quantidade.toString().isNullOrEmpty()) return false;
        if (novo.tcontas.toString().isNullOrEmpty()) return false;
        if (novo.meta.toString().isNullOrEmpty()) return false;
        if (novo.tmeta.toString().isNullOrEmpty()) return false;
        if (novo.tblock.toString().isNullOrEmpty()) return false;
        if (novo.cgrupo.toString().isNullOrEmpty()) return false;
        if (novo.anonimo.toString().isNullOrEmpty()) return false;
        if (novo.trocar.toString().isNullOrEmpty()) return false;
        if (novo.perfil.toString().isNullOrEmpty()) return false;
        if (novo.barra.toString().isNullOrEmpty()) return false;
        let nome = novo.nome.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        let globais = await db.get(`arka.usuarios.${this.token}.globals`);
        if (!globais) return false;
        let aux = [];
        for (let i = 0; i < globais.length; i++) {
            if (globais[i].nome != nome) aux.push(globais[i]);
        }
        novo.nome = nome;
        aux.push(novo);
        await db.set(`arka.usuarios.${this.token}.globals`, aux);
        return true;
    },
    removeGlobalByName: async function (nome2) {
        if (this.token.isNullOrEmpty()) return false;
        if (nome2.isNullOrEmpty()) return false;
        let nome = nome2.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        let globais = await db.get(`arka.usuarios.${this.token}.globals`);
        let grupos = await db.get(`arka.usuarios.${this.token}.grupos`);
        if (!globais) return false;
        let aux = [];
        for (let i = 0; i < globais.length; i++) {
            if (globais[i].nome != nome) aux.push(globais[i]);
        }
        if (grupos != null) {
            let auxgrupos = [];
            for (let j = 0; j > grupos.length; j++) {
                if (grupos[j].global != nome) auxgrupos.push(grupos[i]);
            }
            await db.set(`arka.usuarios.${this.token}.grupos`, auxgrupos);
        }
        await db.set(`arka.usuarios.${this.token}.globals`, aux);
        return true;
    },
    getGlobalByName: async function (nome2) {
        if (this.token.isNullOrEmpty()) return null;
        if (nome2.isNullOrEmpty()) return null;
        let nome = nome2.ReplaceAll(".", "-").ReplaceAll(" ", "").ReplaceAll("@", "").ReplaceAll(":", "").ReplaceAll(";", "").toLowerCase();
        if (nome == "conservador" || nome == "agressivo") {
            if (nome == "conservador") {
                let g = {
                    "nome":"conservador",
                    "delay1":60,
                    "delay2":120,
                    "quantidade":100,
                    "tcontas":60,
                    "meta":300,
                    "tmeta":420,
                    "tblock":720,
                    "cgrupo":0,
                    "anonimo":true,
                    "trocar":false,
                    "perfil":true,
                    "barra":false
                };
                return g;
            } else {
                let g = {
                    "nome":"agressivo",
                    "delay1":25,
                    "delay2":38,
                    "quantidade":300,
                    "tcontas":30,
                    "meta":900,
                    "tmeta":200,
                    "tblock":420,
                    "cgrupo":1,
                    "anonimo":true,
                    "trocar":true,
                    "perfil":false,
                    "barra":true
                };
                return g;
            }
        }
        let globais = await db.get(`arka.usuarios.${this.token}.globals`);
        if (!globais) return null;
        for (let i = 0; i < globais.length; i++) {
            if (globais[i].nome == nome) return globais[i];
        }
        return null;
    },
    getAllGlobal: async function () {
        if (this.token.isNullOrEmpty()) return null;
        return await db.get(`arka.usuarios.${this.token}.globals`);
    }
});

module.exports = Conta;*/