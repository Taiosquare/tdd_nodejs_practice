const User = require('./User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const EmailService = require('../email/EmailService');
const sequelize = require('../config/database');
const EmailException = require('../email/EmailException');
const InvalidTokenException = ('./InvalidTokenException');

const generateToken = (length) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}

const save = async (body) => {
    // const user = Object.assign({}, req.body, { password: hash });

    // const user = {
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: hash
    // }
    
    const { username, email, password } = body;

    const hash = await bcrypt.hash(password, 10);
    
    const user = { username, email, password: hash, activationToken: generateToken(16) };
    
    const transaction = await sequelize.transaction();

    await User.create(user, { transaction });

    try {
        await EmailService.sendAccountActivation(email, user.activationToken);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw new EmailException();
    } 
}

const findByEmail = async (email) => {
    return await User.findOne({ where: { email: email } });
}

const activate = async (token) => {
    const user = await User.findOne({ where: { activationToken: token } });

    if (!user) {
        throw new InvalidTokenException();
        // InvalidTokenException();
    }

    user.inactive = false;
    user.activationToken = null;

    await user.save();
}

module.exports = { save, findByEmail, activate };