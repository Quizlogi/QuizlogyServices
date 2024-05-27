const { Request, ResponseToolkit } = require("@hapi/hapi");

const QuizModel = require("../models/QuizModel");

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const me = async (request, h) => {
  return h.response({
    message: "Success",
    data: request.auth.credentials,
  });
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
const discovery = async (request, h) => {
  try {
    const Quiz = new QuizModel();
    const mostAnswered = await Quiz.getDiscovery();

    return h.response({
      message: "Success",
      data: mostAnswered,
    });
  } catch (err) {
    console.log(err);
  }
};

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
      },
    });

    return h.response({
      message: "Success",
      data: quiz,
    });
  } catch (err) {
    console.log(err);
  }
};

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

    const quiz = await Quiz.db.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
      },
      where: {
        id,
      },
    });

    if (!quiz)
      return h
        .response({
          message: "Quiz not found",
        })
        .code(404);

    return h.response({
      message: "Success",
      data: quiz,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  me,
  discovery,
  allQuiz,
  quizDetail,
};
