const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserQuizModel {
  constructor() {
    this.db = prisma.userQuiz;
  }

  async create(data) {
    return await this.db.create({
      data,
    });
  }

  async getQuizByUserId(user_id) {
    return await this.db.findMany({
      where: {
        user_id,
      },
      include: {
        quiz: {
          include: {
            category: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

module.exports = UserQuizModel;
