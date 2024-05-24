const { Request, ResponseToolkit } = require('@hapi/hapi');
const UserModel = require('../models/UserModel');

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 * @returns 
 */
const getUser = async (request, h) => {
    if (request.auth.credentials.role != 3) return h.response({
        message: 'Forbidden'
    }).code(403);

    try {
        const auth = request.auth.credentials;

        const User = new UserModel();

        let roles = [];
        if (auth.role == 1 || auth.role == 2)
            roles = [1]
        else
            roles = [1, 2, 3]

        const users = await User.getUserByRoleId(roles);

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
const insertUser = async (request, h) => { 
    if (request.auth.credentials.role != 3) return h.response({
        message: 'Forbidden'
    }).code(403);

    try {
        const User = new UserModel();

        const payload = request.payload || {};

        const user = await User.db.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: payload.password,
                role_id: payload.role_id
            }
        });

        return h.response({
            message: 'Success',
            data: user
        }).code(201);
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
    if (request.auth.credentials.role != 3) return h.response({
        message: 'Forbidden'
    }).code(403);
    
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

const updateUser = async (request, h) => {
    if (request.auth.credentials.role != 3) return h.response({
        message: 'Forbidden'
    }).code(403);
    
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

        const payload = request.payload || {};

        const updatedUser = await User.updateUser(userId, {
            username: payload.username,
            email: payload.email,
            password: payload.password,
            role_id: payload.role_id
        });

        return h.response({
            message: 'Success',
            data: updatedUser
        }).code(200);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    insertUser,
    getUser,
    getUserById,
    updateUser
}