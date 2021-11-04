const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const contaController = require('../model/Conta/Controller');
const globalController = require('../model/Global/Controller');
const grupoController = require('../model/Grupo/Controller');
const instagramController = require('../model/Instagram/Controller');
const licenseController = require('../model/LicenseInsta/Controller');
const paymentController = require('../model/Payment/Controller');
const vendaController = require('../model/Venda/Controller');
const dadosController = require('../model/Dados/Controller');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const painelController = require('../controller/painelController');
/*
router.all('/', (req, res, next) => {
    var date1 = new Date();
    var date2 = new Date("10/29/2021 23:00:00");
    const diffTime = Math.abs(date2 - date1);
    var seconds = Math.ceil(diffTime / 1000 );
    res.render('cronometro', {seconds: seconds});
})
*/
router.all('/', (req, res, next) => {
    res.render('index', {})
})

//GET

router.get('/login', forwardAuthenticated, (req, res, next) => {
    var e = req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)];
    if (e != null) {
        if (e.indexOf("Missing credentials") > -1) {
            res.render('logcreate', { message: "Preencha todos os campos", tipo: 1 })
        } else {
            if (e.indexOf("Usuario ou senha errado") > -1) {
                res.render('logcreate', { message: "Usuario ou senha errado", tipo: 1 })
            } else {
                res.render('logcreate', { message: "", tipo: 1 })
            }
        }
    } else {
        res.render('logcreate', { message: "", tipo: 1 })
    }
})

router.get('/registro', forwardAuthenticated, (req, res, next) => {
    res.render('logcreate', { message: "", tipo: 2 })
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'Desconectado');
    res.redirect('/');
});

router.get('/cadastro', (req, res, next) => {
    let json = req.query;
    if (!json.code) {
        res.render('cadafiliado', { message: "", code: "arka" })
    } else {
        res.render('cadafiliado', { message: "", code: json.code })
    }
})

router.all('/painel', ensureAuthenticated, painelController.loadPainel)

router.all('/instagram', ensureAuthenticated, painelController.loadInstagram)

router.all('/grupos', ensureAuthenticated, painelController.loadGrupos)

router.all('/globais', ensureAuthenticated, painelController.loadGlobais)

router.all('/adquirir', ensureAuthenticated, painelController.loadAdquirir)

router.all('/suporte01', ensureAuthenticated, (req, res, next) => res.render('suporte01', { message: "" }))

router.all('/suporte02', ensureAuthenticated, (req, res, next) => res.render('suporte02', { message: "" }))

router.all('/email', ensureAuthenticated, (req, res, next) => res.render('suporte01', { message: "" }))

router.all('/download', ensureAuthenticated, (req, res, next) => res.render('download', { message: "" }))

router.all('/admin', ensureAuthenticated, painelController.loadAdminPainel);

//POST

router.post('/login', forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/painel',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

router.post('/registro', forwardAuthenticated, async (req, res, next) => {
    let json = req.body;
    if (!json) return res.render('logcreate', { message: "Erro", tipo: 2 });
    if (!json.email) return res.render('logcreate', { message: "Informe o email para realizar o cadastro", tipo: 2 });
    if (!json.password) return res.render('logcreate', { message: "Informe a senha para realizar o registro", tipo: 2 });
    if (!json.rpassword) return res.render('logcreate', { message: "Repita a senha para realizar o registro", tipo: 2 });
    if (json.password != json.rpassword) return res.render('logcreate', { message: "As senhas não são iguais", tipo: 2 });
    let u = await contaController.createAccount(json.email, json.password, json.avatar != null ? json.avatar : "nenhum");
    if (!u) return res.render('logcreate', { message: "Email ja cadastrado", tipo: 2 });
    dadosController.addCadastro();
    return res.render('logcreate', { message: "Cadastro realizado com sucesso", tipo: 2 });
})

module.exports = router;