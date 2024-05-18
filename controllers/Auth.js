const { Request, ResponseToolkit } = require('@hapi/hapi');
const UserModel = require('../models/UserModel');

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const Login = async (request, h) => {
    const User = new UserModel();

    const payload = request.payload;
    const user = await User.db.findUnique({
        where: {
            email: payload.email
        }
    });

    if (!user) return h.response({
        message: 'User not found'
    }).code(404);

    return h.response({
        message: 'User found'
    }).code(200);
}


module.exports = {
    Login
}