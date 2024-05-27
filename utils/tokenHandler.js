const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

/**
 *
 * @param {string} payload
 */
const createToken = (payload) => {
  return JWT.sign(payload, secret, { expiresIn: "12h" });
};

/**
 *
 * @param {string} token
 * @returns token payload
 */
const verifyToken = (token) => {
  return JWT.verify(token, secret);
};

/**
 *
 * @param {string} token
 * @returns
 */
const decodeToken = (token) => {
  return JWT.decode(token);
};

module.exports = {
  createToken,
  verifyToken,
  decodeToken,
};
