const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
    constructor() {
        this.db = prisma.user;
    }

    async createUser(data) {
        return await this.db.create({
            data
        });
    }

    async getUsers() {
        return await this.db.findMany();
    }

    async getUser(id) {
        return await this.db.findUnique({
            where: {
                id
            }
        });
    }

    async updateUser(id, data) {
        return await this.db.update({
            where: {
                id
            },
            data
        });
    }

    async deleteUser(id) {
        return await this.db.delete({
            where: {
                id
            }
        });
    }

    async deleteAll() {
        return await this.db.deleteMany();
    }

    async findUserByEmail(email) {
        return await this.db.findUnique({
            where: {
                email
            }
        });
    }

    async findUserByUsername(username) {
        return await this.db.findUnique({
            where: {
                username
            }
        });
    }
}

module.exports = UserModel;