  
const express = require('express');
const uikController = require('../controllers/uik.controller');

const router = express.Router();

router.get('/', uikController.getUiks)
router.put('/violation', uikController.registerViolation)
// router.delete('/:id', userController.deleteUser)
// router.post('/', userController.newUser)
// router.post('/:id/support', userController.newTicket)
// router.put('/:id', userController.updateUser)

module.exports = router;