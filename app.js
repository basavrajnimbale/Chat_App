const express = require('express');

const app = express();
const dotenv = require('dotenv')
dotenv.config()

const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./router/user');
const pageRoutes = require('./router/page')

app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use(pageRoutes);

app.use((req, res) =>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})

sequelize.sync()
    .then(result => {
        console.log("table created");
        app.listen(3000);
    })
    .catch(err => console.log(err));