const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class QuizModel {
  constructor() {
    this.db = prisma.quiz;
  }

  // async getDiscovery
  async getDiscovery() {
    const mostAnswered = await prisma.userQuiz.groupBy({
      by: ["quiz_id"],
      _count: {
        quiz_id: true,
      },
      orderBy: {
        _count: {
          quiz_id: "desc",
        },
      },
      take: 5,
    });

    const quizzes = await Promise.all(
      mostAnswered.map(async (quiz) => {
        const quizData = await prisma.quiz.findUnique({
          where: {
            id: quiz.quiz_id,
          },
          include: {
            category: true,
          },
        });

        const questions = await prisma.question.count({
          where: {
            quiz_id: quiz.quiz_id,
          },
        });

        return {
          ...quizData,
          question_count: questions,
        };
      })
    );

    return quizzes;
  }

  async createQuiz(data) {
    const quiz = await this.db.create({
      data: {
        ...data,
      },
    });

    return quiz;
  }
}

module.exports = QuizModel;
