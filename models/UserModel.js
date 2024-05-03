const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (data) => {
    return prisma.user.create({
        data
    });
}

const getUser = async (where) => {
    return prisma.user.findUnique({
        where
    });
}

module.exports = {
    createUser,
    getUser
};
