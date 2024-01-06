const User = require('../model/users');
const bcrypt = require('bcrypt');

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

module.exports = {
    signup,
};
