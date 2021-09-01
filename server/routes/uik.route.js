  
const express = require('express');
const userController = require('../controllers/uik.controller');

const router = express.Router();

router.get('/', userController.getUiks)
// router.delete('/:id', userController.deleteUser)
// router.post('/', userController.newUser)
// router.post('/:id/support', userController.newTicket)
// router.put('/:id', userController.updateUser)

module.exports = router;