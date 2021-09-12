  
const express = require('express');
const configController = require('../controllers/config.controller');
const router = express.Router();

router.get('/', configController.getConfigs)
router.get('/apply', configController.applyConfig)
router.put('/', configController.setConfigs)
// router.post('/status', authController.isAuthenticated)

module.exports = router;