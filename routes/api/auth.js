const { ServerRoute, Refs } = require("@hapi/hapi");
const { Login, Register } = require("../../controllers/AuthController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "POST",
    path: "/api/login",
    config: {
      auth: false,
    },
    handler: Login,
  },
  {
    method: "POST",
    path: "/api/register",
    config: {
      auth: false,
    },
    handler: Register,
  },
];
