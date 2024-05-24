const { ServerRoute, Refs } = require('@hapi/hapi');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        path: '/api/instructure/quizzes',
        method: 'GET',
        handler
    }
];