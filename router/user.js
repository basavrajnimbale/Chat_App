const express = require('express');

const router = express.Router();

const userController = require('../controller/user');

const middleware = require('../middleware/auth');

router.post('/signup', userController.signup);

router.post('/login', userController.login)

router.post('/chat', middleware.authenticate, userController.saveChat);

router.get('/groups', middleware.authenticate, userController.getGroups);

router.get('/allusers', middleware.authenticate, userController.getUsers);

router.get('/chats', userController.getChats);

router.get('/newUsers', middleware.authenticate, userController.nonGroupMembers);

router.get('/:id', middleware.authenticate, userController.removeParticipant);

module.exports = router;
