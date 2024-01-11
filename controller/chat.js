const User = require('../model/users');
const Chat = require('../model/chats')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const getChats = async (req, res, next) => {
    try{
        let lastId = req.query.id;
        console.log(req.query.id);
        if(lastId === undefined){
            lastId = -1;
        }
        console.log(lastId);
        const message = await Chat.findAll({where: { id: { [Op.gt]: lastId }}, attributes : ['id', 'message', 'username']})
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