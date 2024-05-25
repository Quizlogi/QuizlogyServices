const { ServerRoute, Refs } = require('@hapi/hapi');
const { createQuiz, allQuiz } = require('../../controllers/InstructureController');

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
    {
        path: '/api/instructure/quiz',
        method: 'POST',
        handler: createQuiz,
        options: {
            auth: 'jwt',
            payload: {
                multipart: true
            }
        }
    },
    {
        method: 'GET',
        path: '/api/instructure/quiz',
        config: {
            auth: 'jwt'
        },
        handler: allQuiz
    }
];