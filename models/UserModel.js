const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
    constructor() {
        this.db = prisma.user;
    }

    // atur sesuai kebutuhan
}

module.exports = UserModel;