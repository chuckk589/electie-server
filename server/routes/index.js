const express = require('express');


const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const uikRoute = require('./uik.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/uik', uikRoute);

module.exports = router;