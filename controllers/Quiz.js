const { Request, ResponseToolkit } = require('@hapi/hapi');

const QuizModel = require('../models/QuizModel');

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const discovery = async (request, h) => {
    const Quiz = new QuizModel();

    return h.response({
        message: 'Success',
        data: []
    });
}

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const allQuiz = async (request, h) => {
    try {
        const Quiz = new QuizModel();

        const quiz = await Quiz.db.findMany();

        return h.response({
            message: 'Success',
            data: quiz
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 * @returns 
 */
const quizDetail = async (request, h) => {
    try {
        const Quiz = new QuizModel();
        
        const { id } = request.params;
        if (typeof id != 'number') return h.response({ message: 'Bad Arguments' }).code(404);

        const quiz = await Quiz.db.findOne({
            where: {
                id: request.params.id
            }
        });

        if (!quiz) return h.response({
            message: 'Quiz not found'
        }).code(404);

        return h.response({
            message: 'Success',
            data: quiz
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    discovery,
    allQuiz,
    quizDetail
}