const User = require('../model/users');
const Chat = require('../model/chats')
const Group = require('../model/group')
const Member = require('../model/members')
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
        res.status(200).json({ message: 'Chats fetched', chats ,"group": group.name});
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
        const users = await Promise.all(promises);
        console.log(users,'another one');
        const group = await Group.create({ name, createdBy: req.user.name });
        console.log(group + 'group created');
        const promises2 =  users.map(user => group.addUser(user, { through: { name: user.name, group: group.name } }));
        promises2.push(group.addUser(req.user, { through: { name: req.user.name, group: group.name , isAdmin: true  } }));
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

const grpReq = async (req, res, next) => {
    try {
        const { id } = req.params
        const showgrp = await Group.findAll({ where: { id: id } });;
        res.status(201).json(showgrp);
    } catch (error) {
        console.error("Error fetching group details:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getGrps = async (req, res, next) => {
    try {
        const showgrp = await Group.findAll();
        res.status(201).json(showgrp);
    }
    catch(err){
        console.log(err)
    }
}

const grpDetails = async (req, res, next) => {
    try {
        const group = await Group.findOne({ where: { id: req.query.id } });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const member = await Member.findAll({where: {groupId: req.query.id}});
        res.status(200).json({member});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addAdmin = async (req, res, next) => {
    try {
        const grpId = req.query.id;
        console.log(grpId + 'hiiii')
        const group = await Group.findByPk(grpId);
        const [user] = await group.getUsers({ where: { id: req.user.id } });
        console.log('are you an admin?', user.member.isAdmin, user.isAdmin);
        if (!user.member.isAdmin) {
            return res.status(401).json({ "message": "You must be an admin to make others admin." });
        }
        const userId = req.params.id;
        console.log(userId + 'userId')
        const member = await Member.findByPk(userId);
        const updatedParticipant = await member.update({isAdmin: true});
        res.status(200).json({ "message": 'Success', updatedParticipant });
    }
    catch (err) {
        console.log(err, 'when user update');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

const addParticipants = async (req, res, next) => {
    try {
        const { id } = req.query;
        const group = await Group.findByPk(id);
        const [user] = await group.getUsers({ where: { id: req.user.id } });
        console.log('are you an admin?', user.member.isAdmin);
        if (!user.member.isAdmin) {
            return res.status(401).json({ "message": "Only admins can add new participants to the group." });
        }
        const { members } = req.body;
        const promises = members.map(part => User.findOne({ where: { name: part } }));
        const users = await Promise.all(promises);
        const promises2 =  users.map(user => group.addUser(user, { through: { name: user.name, group: group.name } }));
        const details = await Promise.all(promises2);
        res.status(201).json({ "message": 'Success', details });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

module.exports = {
    knowMembers,
    sendMsg,
    getGrps,
    getGrpChats,
    grpDetails,
    grpReq,
    addAdmin,
    addParticipants
}