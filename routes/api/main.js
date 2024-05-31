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
} = require("../../controllers/UserController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    options: {
      auth: "jwt",
    },
    path: "/api/me",
    handler: me,
  },
  {
    method: "GET",
    path: "/api/quiz",
    options: {
      auth: false,
    },
    handler: allQuiz,
  },
  {
    method: "GET",
    path: "/api/quiz/{id}",
    options: {
      auth: false,
    },
    handler: quizDetail,
  },
  {
    method: "GET",
    path: "/api/quiz/discovery",
    options: {
      auth: false,
    },
    handler: discovery,
  },
  {
    method: "POST",
    path: "/api/quiz/session",
    options: {
      auth: "jwt",
    },
    handler: createSession,
  },
  {
    method: "GET",
    path: "/api/quiz/session",
    options: {
      auth: "jwt",
    },
    handler: getSession,
  },
  {
    method: "GET",
    path: "/api/quiz/session/{session_id}",
    options: {
      auth: "jwt",
    },
    handler: getQuestionsBySessionId,
  },
  {
    method: "POST",
    path: "/api/quiz/session/{session_id}/end",
    options: {
      auth: "jwt",
    },
    handler: endSession,
  },
];
