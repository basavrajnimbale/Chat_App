const express = require('express');

const router = express.Router();

const chatController = require('../controller/chat');

const middleware = require('../middleware/auth');

router.post('/members', middleware.authenticate, chatController.knowMembers);

router.get('/grpChats', chatController.getGrpChats);

router.post('/newMsg', middleware.authenticate, chatController.sendMsg);

router.get('/allGroup',middleware.authenticate,chatController.getGrps)

module.exports = router;