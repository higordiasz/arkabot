const express = require('express');
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const painelController = require('../controller/painelController');

router.all('/gni', ensureAuthenticated, painelController.loadAdminGniPainel);

router.all('/kzom', ensureAuthenticated, painelController.loadAdminKzomPainel);

router.all('/dizu', ensureAuthenticated, painelController.loadAdminDizuPainel);

router.all('/activereport', ensureAuthenticated, painelController.loadAdminReportAllDaysActive);

router.all('/taskreport', ensureAuthenticated, painelController.loadTaskReport);

router.all('/blockreport', ensureAuthenticated, painelController.loadBlockReport);

router.all('/', ensureAuthenticated, painelController.loadAdminPainel);

module.exports = router;