const User = require('../model/users');
const Chat = require('../model/chats')
const Group = require('../model/group')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const getGrpChats = async (req, res, next) => {
    try {
        console.log(req.query.id);
        const group = await Group.findOne({ where: { id: req.query.id } } );
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const chats = await group.getChats();
        // console.log(chats)
        res.status(200).json({ message: 'Chats fetched', chats });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong!", err:"Erro" });
    }
}

const knowMembers = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, members } = req.body;
        const promises = members.map(part => User.findOne({ where: { name: part } }));
        // console.log(promises,'array');
        const users = await Promise.all(promises);
        console.log(users,'another one');
        const group = await Group.create({ name });
        const promises2 =  users.map(user => user.addGroup(group, { through: { name: user.name, group: group.name } }));
        promises2.push(group.addUser(req.user, { through: { name: req.user.name, group: group.name } }));
        const details = await Promise.all(promises2);
        res.status(201).json({message: 'Group successfully created', details });
    }
    catch (err) {
        console.log(err, 'in adding members');
        res.status(500).json({message: "Something went wrong!", err: "Error" });
    }
}

const sendMsg = async (req, res, next) => {
    try {
        const { id } = req.query;
        console.log(id);
        const { message } = req.body;
        const group = await Group.findByPk(id);
        console.log(message, 'group found');
        const result = await group.createChat({ message, username: req.user.name });
        console.log(result);
        res.status(201).json({ message: "Message sent successfully", result });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

const getGrps = async (req, res, next) => {
    try {
        const showgrp = await Group.findAll(
            // attributes: ['name']
          );;
        res.status(201).json(showgrp);
        // console.log(showgrp)
    }
    catch(err){
        console.log(err)
    }
}


module.exports = {
    knowMembers,
    sendMsg,
    getGrps,
    getGrpChats
}