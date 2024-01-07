const express = require('express');

const router = express.Router();

const User = require('../controller/user');

router.post('/signup', User.signup);

router.post('/login', User.login)

module.exports = router;