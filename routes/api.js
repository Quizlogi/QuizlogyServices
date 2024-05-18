const { ServerRoute, Refs } = require('@hapi/hapi');
const { Login, Register } = require('../controllers/Auth');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'POST',
        path: '/api/login',
        handler: Login
    },
    {
        method: 'POST',
        path: '/api/register',
        handler: Register
    }
];