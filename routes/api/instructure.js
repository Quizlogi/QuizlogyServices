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
];
