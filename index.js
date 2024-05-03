require('dotenv').config();
const Hapi = require('@hapi/hapi');

const MainRoutes = require('./routes/main');
const APIRoutes = require('./routes/api');

const AuthMiddleware = require('./middleware/authMiddleware');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    await server.register(AuthMiddleware);

    server.route(MainRoutes, APIRoutes);

    await server.start();

    console.log('\x1b[36m%s\x1b[0m', `Server running on ${server.info.uri}`);
}

init();



