  
const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', authController.login)
// router.post('/logout', authController.logout)
// router.post('/status', authController.isAuthenticated)

module.exports = router;