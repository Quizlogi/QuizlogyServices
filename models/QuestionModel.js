const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class QuestionModel {
  constructor() {
    this.db = prisma.question;
  }
  async createQuestion(data) {
    return await this.db.create({
      data,
    });
  }

  async allQuestion(quiz_id = null) {
    if (quiz_id) {
      return await this.db.findMany({
        where: {
          quiz_id,
        },
        include: {
          options: true,
        },
      });
    } else {
      return await this.db.findMany({
        include: {
          options: true,
        },
      });
    }
  }

  async questionDetail(id) {
    return await this.db.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });
  }

  async updateQuestion(id, data) {
    return await this.db.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteQuestion(id) {
    return await this.db.delete({
      where: {
        id,
      },
    });
  }
}

module.exports = QuestionModel;
