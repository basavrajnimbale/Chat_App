const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

const middleware = require('../middleware/auth');

router.post('/signup', userController.signup);

router.post('/login', userController.login)

router.post('/chat', middleware.authenticate, userController.saveChat);

module.exports = router;