const { ServerRoute, Refs } = require('@hapi/hapi');
const { getUser, getUserById } = require('../../controllers/AdminController');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'GET',
        path: '/api/admin/users',
        config: {
            auth: 'jwt',
            tags: ['main']
        },
        handler: getUser
    },
    {
        method: 'GET',
        path: '/api/admin/users/{id}',
        config: {
            auth: 'jwt'
        },
        handler: getUserById
    }
];