const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Controller = require('../controller/cliquedinController');

//Usuarios

router.post('/checktoken', Controller.checkToken);

//Instagram

router.post('/addinsta', Controller.createConta);

router.post('/removeinsta', Controller.deletarConta);

router.post('/alterinsta', Controller.alterarConta);

router.post('/getinstagram', Controller.getContaByUsername);

router.post('/getallinstagram', Controller.getAllContas);

router.post('/addblock', Controller.addBlock);

router.post('/removeblock', Controller.removeBlock);

router.post('/addchallenge', Controller.addChallenge);

router.post('/removechallenge', Controller.removeChallenge);

router.post('/addincorrect', Controller.addIncorrect);

router.post('/removeincorrect', Controller.removeIncorrect);

router.post('/addseguir', Controller.addSeguir);

router.post('/addcurtir', Controller.addCurtir);

// API Plataforma

router.post('/loginp', Controller.loginPlataforma);

router.post('/dadosp', Controller.dadosPlataforma);

router.post('/perfilp', Controller.perfilsPlataforma);

router.post('/cperfilp', Controller.cadastrarPlataforma);

router.post('/gettaskp', Controller.acaoPlataforma);

router.post('/confirmtaskp', Controller.confirmarPlataforma);

router.post('/jumptaskp', Controller.pularPlataforma);

module.exports = router;