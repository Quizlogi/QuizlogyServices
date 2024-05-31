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

  async endSession(session_id) {
    //
  }
}

module.exports = SessionModel;
