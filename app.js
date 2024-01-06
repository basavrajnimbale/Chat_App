const express = require('express');

const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./router/user');

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use('/user', userRoutes);

// app.use((req, res) =>{
//     res.sendFile(path.join(__dirname,`${req.url}`))
// })

sequelize.sync()
.then(result => {
    console.log("table created");
    app.listen(3000);
})
.catch(err => console.log(err));