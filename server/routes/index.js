const express = require('express');


const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const uikRoute = require('./uik.route');
const memberRoute = require('./member.route');
const configRoute = require('./config.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/uik', uikRoute);
router.use('/member', memberRoute);
router.use('/config', configRoute);

module.exports = router;