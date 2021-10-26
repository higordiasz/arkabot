const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Controller = require('../controller/apiController');

// -------------------------- GET ----------------------

//Usuarios

router.post('/create', Controller.createAccount);

//Instagram


//Grupos


//Globais


//Administração
/*
router.post('/users', Controller.getAllUsers);

router.post('/delete', Controller.deleteAllUsers);
*/
// -------------------- POST ---------------------------

router.post('/useragent', Controller.getUserAgentFromSeed);

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

//Grupos

router.post('/creategroup', Controller.createGroup);

router.post('/altergroup', Controller.alterGroup);

router.post('/removegroup', Controller.deleteGroup);

router.post('/getgroup', Controller.getGroup);

router.post('/getallgroups', Controller.getAllGroups);

//Globais

router.post('/createglobal', Controller.createGlobal);

router.post('/alterglobal', Controller.AlterGlobal);

router.post('/removeglobal', Controller.deleteGlobal);

router.post('/getglobal', Controller.getGlobal);

router.post('/getallglobals', Controller.getAllGlobal);

//Administração

router.post('/addlicence', Controller.addLicence);

router.post('/checklicence', Controller.validateLicence);

module.exports = router;