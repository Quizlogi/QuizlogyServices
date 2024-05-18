const { Request, ResponseToolkit } = require('@hapi/hapi');
const bcrypt = require('bcrypt');

const UserModel = require('../models/UserModel');
const { createToken } = require('../utils/tokenHandler');

/**
 * 
 * @param {Request} request 
 * @param {ResponseToolkit} h 
 */
const Login = async (request, h) => {
    try {
        const User = new UserModel();
    
        const payload = request.payload || {};
        if (!payload.email || !payload.password) return h.response({
            message: 'Email or password is required'
        }).code(400);
    
        const user = await User.db.findUnique({
            where: {
                email: payload.email
            }
        });
    
        if (!user) return h.response({
            message: 'User not found'
        }).code(404);
    
        const isValid = await bcrypt.compare(payload.password, user.password);
        if (!isValid) return h.response({
            message: 'Invalid password'
        }).code(401);
    
        const token = createToken({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username
        });
    
        return h.response({
            message: 'Login success',
            token
        }).code(200);
    } catch (err) {
        console.error(err);
    }
}

const Register = async (request, h) => {
    try {
        const User = new UserModel();
    
        const payload = request.payload || {};
        if (!payload.email || !payload.password || !payload.username) return h.response({
            message: 'Email, password, and username is required'
        }).code(400);
    
        const user = await User.db.findUnique({
            where: {
                email: payload.email,
                username: payload.username
            }
        });
    
        if (user) return h.response({
            message: 'Email already registered'
        }).code(400);
    
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const newUser = await User.db.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                username: payload.username
            }
        });
    
        return h.response({
            message: 'Register success',
            data: newUser
        }).code(201);
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    Login,
    Register
}