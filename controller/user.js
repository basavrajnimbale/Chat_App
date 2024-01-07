const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const signup = async (req, res, next) => {
    try {
        const { name, email, phonenumber, password } = req.body;
        
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phonenumber) || isStringInvalid(password)) {
            return res.status(400).json({ error: "Bad parameters. Something is missing." });
        }

        // Check if user with the provided email already exists
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists, Please Login" });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: "Error hashing password." });
            }
            await User.create({ name, email, phonenumber, password: hash });
            return res.status(201).json({ message: 'Successfuly create new user' });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

function generateAccessToken (id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET)
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email id or password missing', success: false })
        }
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Something wend wrong' })
                }
                if (result == true) {
                    res.status(200).json({ success: true, message: "user logged in successfully", token: generateAccessToken(user[0].id, user[0].name) })
                }
                else {
                    return res.status(401).json({ success: false, message: 'password is incorrect' })
                }
            })
        } else {
            return res.status(404).json({ success: false, message: 'user doesnot exitst' })
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

module.exports = {
    signup,
    login
};
