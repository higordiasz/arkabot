const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Controller = require('../controller/dizuController');

//Usuarios

router.post('/login', Controller.loginBot);

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

module.exports = router;