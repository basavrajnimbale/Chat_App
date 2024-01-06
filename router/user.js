const express = require('express');

const router = express.Router();

const User = require('../controller/user');

router.post('/signup', User.signup);

module.exports = router;