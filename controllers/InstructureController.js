const { Request, ResponseToolkit } = require('@hapi/hapi');

const QuizModel = require('../models/QuizModel');

/**
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const createQuiz = async (request, h) => {
    try {
        const Quiz = new QuizModel();
        const { quiz, options } = request.payload;

        if (!quiz || !options) return h.response({
            message: 'Invalid payload'
        }).code(400);

        if (typeof quiz !== 'object' || !Array.isArray(options)) return h.response({
            message: 'Invalid payload'
        }).code(400);

        const quizData = await Quiz.createQuiz(quiz, options);
    } catch (err) {
        console.error(err);
    }
}