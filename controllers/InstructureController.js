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

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const allQuiz = async (request, h) => {
    try {
        const Quiz = new QuizModel();

        const quiz = await Quiz.db.findMany({
            include: {
                category: true,
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        return h.response({
            message: 'Success',
            data: quiz
        });
    } catch (err) {
        console.log(err);
    }
}

const quizDetail = async (request, h) => {
    try {
        const Quiz = new QuizModel();
        const { id } = request.params;

        if (!id) return h.response({
            message: 'Invalid payload'
        }).code(400);

        const quiz = await Quiz.db.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                category: true,
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        return h.response({
            message: 'Success',
            data: quiz
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createQuiz,
    allQuiz,
    quizDetail
};