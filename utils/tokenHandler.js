const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const createToken = (payload) => {
    return JWT.sign(payload, secret, { expiresIn: '12h' });
}

const verifyToken = (token) => {
    return JWT.verify(token, secret);
}

module.exports = {
    createToken,
    verifyToken
};