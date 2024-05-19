const { ServerRoute, Refs } = require('@hapi/hapi');
const { Login, Register } = require('../controllers/Auth');
const { getUser, getUserById } = require('../controllers/User');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'POST',
        path: '/api/login',
        config: {
            auth: false
        },
        handler: Login
        
    },
    {
        method: 'POST',
        path: '/api/register',
        config: {
            auth: false
        },
        handler: Register
    },
    {
        method: 'GET',
        path: '/api/users',
        config: {
            auth: 'jwt'
        },
        handler: getUser
    },
    {
        method: 'GET',
        path: '/api/users/{id}',
        config: {
            auth: 'jwt'
        },
        handler: getUserById
    }
];