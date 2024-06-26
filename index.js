require("dotenv").config();
const Hapi = require("@hapi/hapi");
const HapiAuthJWT = require("hapi-auth-jwt2");

const MainRoutes = require("./routes/web");
const APIRoutes = require("./routes/api");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  await server.register(HapiAuthJWT);
  await server.register(require("@hapi/inert"));

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    verify: {
      aud: "urn:audience",
      iss: "urn:issuer",
      sub: false,
      // time 24 hours
      maxAgeSec: 86400,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts,
      };
    },
  });

  server.auth.default("jwt");

  server.route({
    method: "GET",
    path: "/uploads/{param*}",
    options: {
      auth: false,
    },
    handler: {
      directory: {
        path: "uploads",
        redirectToSlash: true,
        index: true,
      },
    },
  });

  server.route(MainRoutes);
  server.route(APIRoutes);

  await server.start();

  console.log("\x1b[36m%s\x1b[0m", `Server running on ${server.info.uri}`);
};

init();
