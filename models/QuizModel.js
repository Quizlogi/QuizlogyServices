const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class QuizModel {
    constructor() {
        this.db = prisma.quiz;
    }

    // async getDiscovery
}

module.exports = QuizModel;