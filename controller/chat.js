const User = require('../model/users');
const Chat = require('../model/chats')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getChats = async (req, res, next) => {
    try{
        const message = await Chat.findAll()
        // console.log(message);
        res.status(201).json(message)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

module.exports = {
    getChats
}