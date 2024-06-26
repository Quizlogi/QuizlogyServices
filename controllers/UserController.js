const { Request, ResponseToolkit } = require("@hapi/hapi");

const QuizModel = require("../models/QuizModel");
const SessionModel = require("../models/SessionModel");
const UserModel = require("../models/UserModel");
const UserQuizModel = require("../models/UserQuizModel");
const CategoryModel = require("../models/CategoryModel");

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const me = async (request, h) => {
  try {
    const { credentials } = request.auth;
    const User = new UserModel();

    const user = await User.db.findFirst({
      where: {
        id: credentials.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        Session: true,
      },
    });

    return h.response({
      message: "Success",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const updateUser = async (request, h) => {
  const User = new UserModel();

  const { credentials } = request.auth;
  const data = request.payload;

  const user = await User.updateUser(credentials.id, data);

  return h.response({
    message: "Success",
    data: user,
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
    const newest = await Quiz.getNewest();

    return h.response({
      message: "Success",
      data: {
        popular: mostAnswered,
        newest,
      },
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
        user: {
          select: {
            name: true,
          },
        },
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
        image: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        session: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
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

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const searchQuiz = async (request, h) => {
  try {
    const Quiz = new QuizModel();

    const { query } = request.query;

    if (!query)
      return h.response({
        message: "Success",
        data: [],
      });

    const quiz = await Quiz.db.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
      include: {
        category: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      take: 6
    });

    return h.response({
      message: "Success",
      data: quiz,
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
const historyQuiz = async (request, h) => {
  try {
    const UserQuiz = new UserQuizModel();

    const { credentials } = request.auth;

    const sessions = await UserQuiz.getQuizByUserId(credentials.id);

    return h.response({
      message: "Success",
      data: sessions,
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
const historyQuizById = async (request, h) => {
  try {
    const UserQuiz = new UserQuizModel();

    const { id } = request.params;

    const userQuiz = await UserQuiz.db.findFirst({
      where: {
        id,
      },
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
      },
    });

    return h.response({
      message: "Success",
      data: userQuiz,
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
const getAllCategories = async (request, h) => {
  try {
    const Category = new CategoryModel();

    const categories = await Category.getCategory();

    return h.response({
      message: "Success",
      data: categories,
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
const getCategoryById = async (request, h) => {
  try {
    const Category = new CategoryModel();

    const { id } = request.params;

    const category = await Category.db.findUnique({
      where: {
        id,
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            category: true,
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    });

    if (!category)
      return h.response({
        message: "Category not found",
      });

    return h.response({
      message: "Success",
      data: category,
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
const createSession = async (request, h) => {
  try {
    const Session = new SessionModel();
    const Quiz = new QuizModel();

    const { credentials } = request.auth;
    const { quiz_id } = request.payload ?? {};

    if (!quiz_id)
      return h.response({ message: "Quiz ID is required" }).code(400);

    // check if quiz_id is valid
    const quiz = await Quiz.db.findFirst({
      where: {
        id: quiz_id,
      },
    });

    if (!quiz)
      return h.response({
        message: "Quiz not found",
      });

    const sessionExists = await Session.getSessionByUserId(credentials.id);
    if (sessionExists.length > 0)
      return h
        .response({
          message: "Session already exists",
        })
        .code(400);

    const session = await Session.createSession(credentials.id, quiz_id);

    return h.response({
      message: "Success",
      data: session,
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
const getSession = async (request, h) => {
  const Session = new SessionModel();

  const { credentials } = request.auth;

  const session = await Session.getSessionByUserId(credentials.id);

  return h.response({
    message: "Success",
    data: session,
  });
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getQuestionsBySessionId = async (request, h) => {
  const Session = new SessionModel();

  const { credentials } = request.auth;
  const { session_id } = request.params;

  const session = await Session.getQuestionsBySessionId(session_id);

  if (session.user.id !== credentials.id)
    return h.response({
      message: "Unauthorized",
    });

  return h.response({
    message: "Success",
    data: session,
  });
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const endSession = async (request, h) => {
  try {
    const Session = new SessionModel();

    const { credentials } = request.auth;
    const { session_id } = request.params;
    const { data } = request.payload ?? {};

    const session = await Session.getQuestionsBySessionId(session_id);
    if (!session)
      return h.response({
        message: "Session not found",
      });

    if (session.user.id !== credentials.id)
      return h.response({
        message: "Unauthorized",
      });

    const result = await Session.endSession(session_id, data);

    return h.response({
      data: result,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    return h.response({
      message: err.message,
    });
  }
};

module.exports = {
  me,
  updateUser,
  discovery,
  allQuiz,
  quizDetail,
  searchQuiz,
  historyQuiz,
  historyQuizById,
  getAllCategories,
  getCategoryById,
  createSession,
  getSession,
  getQuestionsBySessionId,
  endSession,
};
