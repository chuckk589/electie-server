  
const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', userController.getUsers)
// router.delete('/:id', userController.deleteUser)
// router.post('/', userController.newUser)
// router.post('/:id/support', userController.newTicket)
router.put('/', userController.updateUser)

module.exports = router;