const { ServerRoute, Refs } = require('@hapi/hapi');
const { Login } = require('../controllers/Auth');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: Login
    }
];