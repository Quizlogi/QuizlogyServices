const { ServerRoute, Refs } = require("@hapi/hapi");
const {
  allQuiz,
  discovery,
  me,
  quizDetail,
  createSession,
  getSession,
  getQuestionsBySessionId,
  endSession,
  updateUser,
  historyQuiz,
  getAllCategories,
  getCategoryById,
  historyQuizById,
  searchQuiz,
} = require("../../controllers/UserController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    config: {
      auth: "jwt",
    },
    path: "/api/me",
    handler: me,
  },
  {
    method: "PUT",
    config: {
      auth: "jwt",
    },
    path: "/api/me",
    handler: updateUser,
  },
  {
    method: "GET",
    path: "/api/quiz",
    config: {
      auth: false,
    },
    handler: allQuiz,
  },
  {
    method: "GET",
    path: "/api/quiz/{id}",
    config: {
      auth: false,
    },
    handler: quizDetail,
  },
  {
    method: "GET",
    path: "/api/quiz/search",
    config: {
      auth: false,
    },
    handler: searchQuiz,
  },
  {
    method: "GET",
    path: "/api/quiz/history",
    config: {
      auth: "jwt",
    },
    handler: historyQuiz,
  },
  {
    method: "GET",
    path: "/api/quiz/history/{id}",
    config: {
      auth: "jwt",
    },
    handler: historyQuizById,
  },
  {
    method: "GET",
    path: "/api/quiz/category",
    config: {
      auth: false,
    },
    handler: getAllCategories,
  },
  {
    method: "GET",
    path: "/api/quiz/category/{id}",
    config: {
      auth: false,
    },
    handler: getCategoryById,
  },
  {
    method: "GET",
    path: "/api/quiz/discovery",
    config: {
      auth: false,
    },
    handler: discovery,
  },
  {
    method: "POST",
    path: "/api/quiz/session",
    config: {
      auth: "jwt",
    },
    handler: createSession,
  },
  {
    method: "GET",
    path: "/api/quiz/session",
    config: {
      auth: "jwt",
    },
    handler: getSession,
  },
  {
    method: "GET",
    path: "/api/quiz/session/{session_id}",
    config: {
      auth: "jwt",
    },
    handler: getQuestionsBySessionId,
  },
  {
    method: "POST",
    path: "/api/quiz/session/{session_id}/end",
    config: {
      auth: "jwt",
    },
    handler: endSession,
  },
];
