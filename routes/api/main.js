const { ServerRoute, Refs } = require("@hapi/hapi");
const {
  allQuiz,
  discovery,
  me,
  quizDetail,
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
    path: "/api/quiz/discovery",
    config: {
      auth: false,
    },
    handler: discovery,
  },
];
