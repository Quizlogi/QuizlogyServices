const { ServerRoute, Refs } = require('@hapi/hapi');
const { getUser, getUserById, insertUser } = require('../../controllers/AdminController');

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
        method: 'POST',
        path: '/api/admin/users',
        config: {
            auth: 'jwt',
            tags: ['main']
        },
        handler: insertUser
    },
    {
        method: 'GET',
        path: '/api/admin/users/{id}',
        config: {
            auth: 'jwt',
            tags: ['main']
        },
        handler: getUserById
    }
];