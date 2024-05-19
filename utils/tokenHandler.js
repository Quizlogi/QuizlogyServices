const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const createToken = (payload) => {
    return JWT.sign(payload, secret, { expiresIn: '12h' });
}

const verifyToken = (token) => {
    return JWT.verify(token, secret);
}

const decodeToken = (token) => {
    return JWT.decode(token);
}

module.exports = {
    createToken,
    verifyToken,
    decodeToken
};