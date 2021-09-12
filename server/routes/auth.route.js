  
const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', authController.login)
router.post('/logout', authController.logout)

// router.get('/oauth', authController.getGoogleAuthLink)
// router.get('/oauthcb', authController.oauthcallback)
// router.post('/status', authController.isAuthenticated)

router.get('/zadarma', authController.getZadarmaAuthKey)

module.exports = router;