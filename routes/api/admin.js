const { ServerRoute, Refs } = require('@hapi/hapi');
const { getUser, getUserById, insertUser, updateUser } = require('../../controllers/AdminController');

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
            auth: 'jwt',
            tags: ['main']
        },
        handler: getUserById
    },
    {
        method: 'PUT',
        path: '/api/admin/users/{id}',
        config: {
            auth: 'jwt',
            tags: ['main']
        },
        handler: updateUser
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
    
    
];