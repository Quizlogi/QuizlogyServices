const { ServerRoute, Refs } = require("@hapi/hapi");
const UserModel = require("../models/UserModel");
/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    config: {
      auth: false,
    },
    path: "/",
    handler: (request, h) => {
      return h.response({
        status: "success",
        message: "Welcome to Quizlogy API",
        documentation: "https://quiz-dev.mengkodingkan.com",
      });
    },
  },
];
