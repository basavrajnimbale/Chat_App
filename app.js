const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT

const User = require('./model/users');
const Chat = require('./model/chats');
const Group = require('./model/group');
const Member = require('./model/members');

const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const sequelize = require('./util/database');

const userRoutes = require('./router/user');
const pageRoutes = require('./router/page');
const groupRoutes = require('./router/chat');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8080","https://admin.socket.io"]
    }
});

app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json({ extended: false }));
app.use(compression());

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use(pageRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
});

Chat.belongsTo(Group);
Group.hasMany(Chat);

User.belongsToMany(Group, { through: Member });
Group.belongsToMany(User, { through: Member });

io.on('connection', socket => {
    socket.on('join-group', group => {
        console.log(group, 'the user joins this group');
        socket.join(group);
    });

    socket.on('new-msg', (message, group, sender) => {
        console.log(message, group, 'these msgs were newer');
        socket.to(group).emit('sent-msgs', sender, message);
    });
});

instrument(io, { auth: false });

sequelize.sync()
    .then(result => {
        console.log("table created");
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));
