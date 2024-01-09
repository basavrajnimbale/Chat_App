const express = require('express');

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const path = require('path');

const User = require('./model/users');
const Chat = require('./model/chats');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./router/user');
const pageRoutes = require('./router/page');
const groupRoutes = require('./router/chat')

app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use(pageRoutes);

app.use((req, res) =>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})

Chat.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Chat);

sequelize.sync()
    .then(result => {
        console.log("table created");
        app.listen(3000);
    })
    .catch(err => console.log(err));