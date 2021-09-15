  
const express = require('express');
const configController = require('../controllers/config.controller');
const router = express.Router();

router.get('/', configController.getConfigs)
router.get('/apply', configController.applyConfig)
router.put('/', configController.setConfigs)
// router.post('/status', authController.isAuthenticated)

//utilities
router.get('/utilities', configController.utilities)
router.post('/utilities/genChats', configController.genChats)
router.post('/utilities/genGroups', configController.genGroups)
module.exports = router;