const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SessionModel {
  constructor() {
    this.db = prisma.session;
  }

  /**
   * @param {string} user_id
   * @param {string} quiz_id
   */
  async createSession(user_id, quiz_id) {
    return await this.db.create({
      data: {
        user_id,
        quiz_id,
      },
    });
  }

  /**
   * @param {string} user_id
   */
  async getSessionByUserId(user_id) {
    return await this.db.findMany({
      where: {
        user_id,
      },
    });
  }

  async getQuizBySessionId(session_id) {
    return await this.db.findFirst({
      where: {
        id: session_id,
      },
      select: {
        user: {
          select: {
            name: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            questions: {
              select: {
                id: true,
                question: true,
                options: {
                  select: {
                    id: true,
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getQuestionsBySessionId(session_id) {
    return await this.db.findFirst({
      where: {
        id: session_id,
      },

      select: {
        user: {
          select: {
            id: true,
            name: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            questions: {
              select: {
                id: true,
                question: true,
                options: {
                  select: {
                    id: true,
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async endSession(session_id, data) {
    /**
     * data
     * [
     *  { question_id, option_id }
     * ]
     */
    const UserQuiz = prisma.userQuiz;
    const UserAnswer = prisma.userAnswer;

    const session = await this.db.findFirst({
      where: {
        id: session_id,
      },
    });

    const userQuiz = await UserQuiz.create({
      data: {
        user_id: session.user_id,
        quiz_id: session.quiz_id,
        score: 0,
      },
    });

    const userAnswer = [];
    for (const item of data) {
      // validate question_id and option_id
      const question = await prisma.question.findFirst({
        where: {
          id: item.question_id,
        },
      });

      if (!question) {
        // remove userQuiz
        await UserQuiz.delete({
          where: {
            id: userQuiz.id,
          },
        });

        throw new Error("Question not found");
      }

      const option = await prisma.option.findFirst({
        where: {
          id: item.option_id,
        },
      });

      if (!option) {
        // remove userQuiz
        await UserQuiz.delete({
          where: {
            id: userQuiz.id,
          },
        });

        throw new Error("Option not found");
      }

      userAnswer.push({
        user_quiz_id: userQuiz.id,
        question_id: item.question_id,
        option_id: item.option_id,
      });
    }

    // get correct answers
    const questions = await prisma.question.findMany({
      where: {
        quiz_id: session.quiz_id,
      },
    });

    let correctAnswers = 0;
    for (let j = 0; j < questions.length; j++) {
      const options = await prisma.option.findMany({
        where: {
          question_id: questions[j].id,
        },
      });

      const selectedOption = options.find(
        (option) => option.id === userAnswer[j].option_id
      );
      if (selectedOption.is_correct) {
        correctAnswers++;
      }
    }

    const score = (correctAnswers / questions.length) * 100;

    await UserQuiz.update({
      where: {
        id: userQuiz.id,
      },
      data: {
        score: score,
      },
    });

    await UserAnswer.createMany({
      data: userAnswer,
    });

    // delete session
    await this.db.delete({
      where: {
        id: session_id,
      },
    });

    userQuiz.score = score;

    return userQuiz;
  }
}

module.exports = SessionModel;
