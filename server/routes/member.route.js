  
const express = require('express');
const memberController = require('../controllers/member.controller');

const router = express.Router();

router.get('/', memberController.get)
// router.delete('/:id', userController.deleteUser)
// router.post('/', userController.newUser)
// router.post('/:id/support', userController.newTicket)
router.put('/', memberController.put)

module.exports = router;