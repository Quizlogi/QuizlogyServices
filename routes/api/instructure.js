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
  getAllconfig,
  createOption,
  editOption,
  getOption,
  removeOption,
  getAllOptions,
} = require("../../controllers/InstructureController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    path: "/api/instructure/category",
    config: {
      auth: "jwt",
    },
    handler: getAllCategory,
  },
  {
    method: "GET",
    path: "/api/instructure/category/{id}",
    config: {
      auth: "jwt",
    },
    handler: getCategory,
  },
  {
    method: "POST",
    path: "/api/instructure/category",
    handler: createCategory,
    config: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: "/api/instructure/category/{id}",
    handler: editCategory,
    config: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/api/instructure/category/{id}",
    handler: removeCategory,
    config: {
      auth: "jwt",
    },
  },
  {
    path: "/api/instructure/quiz",
    method: "POST",
    handler: createQuiz,
    config: {
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
    config: {
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
    config: {
      auth: "jwt",
    },
    handler: allQuiz,
  },
  {
    method: "GET",
    path: "/api/instructure/quiz/{id}",
    config: {
      auth: "jwt",
    },
    handler: quizDetail,
  },
  {
    method: "GET",
    path: "/api/instructure/quiz/{id}/question",
    config: {
      auth: "jwt",
    },
    handler: getAllQuestion,
  },
  {
    method: "POST",
    path: "/api/instructure/quiz/{id}/question",
    config: {
      auth: "jwt",
    },
    handler: createQuestion,
  },
  {
    method: "PUT",
    path: "/api/instructure/quiz/{id}/question/{questionId}",
    config: {
      auth: "jwt",
    },
    handler: editQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question",
    config: {
      auth: "jwt",
    },
    handler: getAllQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question/{id}",
    config: {
      auth: "jwt",
    },
    handler: getQuestion,
  },
  {
    method: "DELETE",
    path: "/api/instructure/question/{id}",
    config: {
      auth: "jwt",
    },
    handler: removeQuestion,
  },
  {
    method: "GET",
    path: "/api/instructure/question/{id}/option",
    config: {
      auth: "jwt",
    },
    handler: getAllOptions,
  },
  {
    method: "POST",
    path: "/api/instructure/question/{id}/option",
    config: {
      auth: "jwt",
    },
    handler: createOption,
  },
  {
    method: "PUT",
    path: "/api/instructure/question/{id}/option/{optionId}",
    config: {
      auth: "jwt",
    },
    handler: editOption,
  },
  {
    method: "GET",
    path: "/api/instructure/option",
    config: {
      auth: "jwt",
    },
    handler: getAllOptions,
  },
  {
    method: "GET",
    path: "/api/instructure/option/{id}",
    config: {
      auth: "jwt",
    },
    handler: getOption,
  },
  {
    method: "DELETE",
    path: "/api/instructure/option/{id}",
    config: {
      auth: "jwt",
    },
    handler: removeOption,
  },
];
