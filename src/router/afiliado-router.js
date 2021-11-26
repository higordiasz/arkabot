const express = require('express');
const router = express.Router();
const path = require('path')
const passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Controller = require('../controller/afiliadoController');

// -------------------------- GET ----------------------

router.get('/', ensureAuthenticated, Controller.loadPageAfiliadoByCode);

// ------------------------- POST ----------------------

router.post('/create', Controller.createAfiliado);

router.post('/registro', Controller.createCadAfiliado);

module.exports = router;