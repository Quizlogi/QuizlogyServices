const { Request, ResponseToolkit } = require('@hapi/hapi');
const UserModel = require('../models/UserModel');
/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 * @returns 
 */
const getUser = async (request, h) => { 
    try {
        console.log(request.auth.credentials);
        const User = new UserModel();

        const users = await User.getUserByRoleId([1]);

        return h.response({
            message: 'Success',
            data: users
        }).code(200);
    } catch (err) {
        console.error(err);
    }
}

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 * @returns 
 */
const getUserById = async (request, h) => {
    try {
        const User = new UserModel();

        const userId = request.params.id

        const user = await User.getUserById(userId);

        if (!user) return h.response({
            message: 'User not found'
        }).code(404);
        
        if (request.auth.credentials.role === 1 && (user.role_id === 2 || user.role_id === 3)) {
            return h.response({
                message: 'Forbidden'
            }).code(403);
        }

        return h.response({
            message: 'Success',
            data: user
        }).code(200);
    } catch (err) {
        console.error(err);
    }
}

const addUser = async (request, h) => {
    try {
        const User = new UserModel();

        const payload = request.payload || {};
        if (!payload.name || !payload.email || !payload.password || !payload.username) return h.response({
            message: 'Email, Name, password, and username is required'
        }).code(400);

        const user = await User.db.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: payload.password,
                username: payload.username
            }
        });

        return h.response({
            message: 'User created',
            data: user
        }).code(201);
    } catch (err) {
        console.error(err);
    }
}



module.exports = {
    getUser,
    getUserById,
}