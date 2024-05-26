const { ServerRoute, Refs } = require("@hapi/hapi");

const {
  createQuiz,
  allQuiz,
  quizDetail,
  getAllCategory,
  getCategory,
  createCategory,
  editCategory,
  removeCategory,
  editQuiz,
  getAllQuestion,
  getQuestion,
  createQuestion,
  editQuestion,
  removeQuestion,
  getAllOptions,
  createOption,
} = require("../../controllers/InstructureController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    path: "/api/instructure/category",
    options: {
      auth: "jwt",
    },
    handler: getAllCategory,
  },
  {
    method: "GET",
    path: "/api/instructure/category/{id}",
    options: {
      auth: "jwt",
    },
    handler: getCategory,
  },
  {
    method: "POST",
    path: "/api/instructure/category",
    handler: createCategory,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: "/api/instructure/category/{id}",
    handler: editCategory,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/api/instructure/category/{id}",
    handler: removeCategory,
    options: {
      auth: "jwt",
    },
  },
  {
    path: "/api/instructure/quiz",
    method: "POST",
    handler: createQuiz,
    options: {
      auth: "jwt",
      payload: {
        multipart: true,
        maxBytes: 52428800,
      },
    },
  },
  {
    method: "PUT",
    path: "/api/instructure/quiz/{id}",
    options: {
      auth: "jwt",
      payload: {
        multipart: true,
        maxBytes: 52428800,
      },
    },
    handler: editQuiz,
  },
  {
    method: "GET",
    path: "/api/instructure/quiz",
    options: {
      auth: "jwt",
    },
    handler: allQuiz,
  },
  {
    method: "GET",
    path: "/api/instructure/quiz/{id}",
    options: {
      auth: "jwt",
    },
    handler: quizDetail,
  },
  {
    method: "GET",
    path: "/api/instructure/quiz/{id}/question",
    options: {
      auth: "jwt",
    },
    handler: getAllQuestion,
  },
  {
    method: "POST",
    path: "/api/instructure/quiz/{id}/question",
    options: {
      auth: "jwt",
    },
    handler: createQuestion,
  },
  {
    method: "PUT",
    path: "/api/instructure/quiz/{id}/question/{questionId}",
    options: {
      auth: "jwt",
    },
    handler: editQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question",
    options: {
      auth: "jwt",
    },
    handler: getAllQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question/{id}",
    options: {
      auth: "jwt",
    },
    handler: getQuestion,
  },
  {
    method: "DELETE",
    path: "/api/instructure/question/{id}",
    options: {
      auth: "jwt",
    },
    handler: removeQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question/{id}/option",
    options: {
      auth: "jwt",
    },
    handler: getAllOptions,
  },
  {
    method: "POST",
    path: "/api/instructure/question/{id}/option",
    options: {
      auth: "jwt",
    },
    handler: createOption,
  },
];
