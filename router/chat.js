const express = require('express');

const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './Images')
        },
        filename: (req, file, cb) => {
            console.log(file, 'once see the file');
            req.file = file;
            cb(null, Date.now() + path.extname(file.originalname))
        }
    }
);
const upload = multer({ storage: storage })

const chatController = require('../controller/chat');

const middleware = require('../middleware/auth');

router.post('/members', middleware.authenticate, chatController.knowMembers);

router.get('/grpChats', chatController.getGrpChats);

router.post('/newMsg', upload.single("file"), middleware.authenticate, chatController.sendMsg);

router.get('/allGroup', middleware.authenticate, chatController.getGrps)
                
router.get('/allUser', chatController.grpDetails)

router.get('/reqGroup/:id', chatController.grpReq)

router.get('/:id', middleware.authenticate, chatController.addAdmin)

router.get('/findGroupId', middleware.authenticate, chatController.addParticipants)

router.post('/member', middleware.authenticate, chatController.addParticipants);

module.exports = router