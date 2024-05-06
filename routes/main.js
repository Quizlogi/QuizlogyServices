const { ServerRoute, Refs } = require('@hapi/hapi');
const UserModel = require('../models/UserModel');
/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const User = new UserModel();

            return 'Hello, world!';
        }
    }
];