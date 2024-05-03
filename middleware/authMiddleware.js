const { Plugin, PluginBase } = require('@hapi/hapi');
const { verifyToken } = require('../utils/tokenHandler');

/**
 * @type {Plugin<PluginBase>}
 */
const authMiddleware = {
    name: 'authMiddleware',
    version: '1.0.0',
    register: async function (server, options) {
        server.ext('onPreResponse', (request, h) => {
            const requestPath = request.route.path;
            if (requestPath.startsWith('/api')) {
                const token = request.headers.authorization;
                if (!token) {
                    return h.response({ message: 'Token not found' }).code(401);
                }

                try {
                    verifyToken(token);
                } catch (error) {
                    return h.response({ message: 'Invalid token' }).code(401);
                }
            }

            return h.continue;
        });
    }
}

module.exports = authMiddleware;