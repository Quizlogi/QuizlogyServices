const { ServerRoute, Refs } = require('@hapi/hapi');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello, world!';
        }
    }
];