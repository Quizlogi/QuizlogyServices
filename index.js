require('dotenv').config();
const Hapi = require('@hapi/hapi');

const MainRoutes = require('./routes/main');
const APIRoutes = require('./routes/api');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    server.route(MainRoutes);
    server.route(APIRoutes);

    await server.start();
    // with color green
    console.log('\x1b[32m', `Server running on ${server.info.uri}`);
}

init();



