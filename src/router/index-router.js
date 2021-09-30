const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const painelController = require('../controller/painelController');

router.all('/', (req, res, next) => {
    res.render('index', {});
})

//GET

router.get('/login', forwardAuthenticated, (req, res, next) => {
    var e = req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)];
    if (e != null) {
        if (e.indexOf("Missing credentials") > -1) {
            res.render('login', { message: "Preencha todos os campos" })
        } else {
            if (e.indexOf("Usuario ou senha errado") > -1) {
                res.render('login', { message: "Usuario ou senha errado" })
            } else {
                res.render('login', { message: "" })
            }
        }
    } else {
        res.render('login', { message: "" })
    }
})

router.get('/registro', forwardAuthenticated, (req, res, next) => {
    res.render('register', { Cadastro: "" })
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'Desconectado');
    res.redirect('/');
  });

router.all('/painel', ensureAuthenticated, painelController.loadPainel)

router.all('/instagram', ensureAuthenticated, painelController.loadInstagram)

router.all('/grupos', ensureAuthenticated, painelController.loadGrupos)

router.all('/globais', ensureAuthenticated, painelController.loadGlobais)

router.all('/adquirir', ensureAuthenticated, painelController.loadAdquirir)

//POST

router.post('/login', forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/painel',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

router.post('/registro', forwardAuthenticated, (req, res, next) => {
    let json = req.body;
    if (!json) return res.render('register', { Cadastro: "Erro" });
    if (!json.email) return res.render('register', { Cadastro: "Informe o email para realizar o cadastro" });
    if (!json.password) return res.render('register', { Cadastro: "Informe a senha para realizar o registro" });
    if (!json.rpassword) return res.render('register', { Cadastro: "Repita a senha para realizar o registro" });
    if (json.password != json.rpassword) return res.render('register', { Cadastro: "As senhas não são iguais" });
    let u = Object.create(Conta);
    u = await u.createAccount(json.email, json.password, json.avata != null ? json.avatar : "");
    if (!u) return res.render('register', { Cadastro: "Email ja cadastrado" }); res.status(200).send({ status: 0, erro: "Esse email ja foi cadastrado", data: [] });
    return res.render('register', { Cadastro: "Cadastro realizado com sucesso" });
})

module.exports = router;