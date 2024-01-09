const express = require('express');

const router = express.Router();

const chatController = require('../controller/chat');

const middleware = require('../middleware/auth');

router.get('/chats', chatController.getChats);

module.exports = router;