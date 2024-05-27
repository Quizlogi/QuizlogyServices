const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class OptionModel {
  constructor() {
    this.db = prisma.option;
  }

  async createOption(data) {
    return await this.db.create({
      data,
    });
  }

  async allOption(question_id = null) {
    if (question_id) {
      return await this.db.findMany({
        where: {
          question_id,
        },
      });
    } else {
      return await this.db.findMany();
    }
  }

  async optionDetail(id) {
    return await this.db.findUnique({
      where: {
        id,
      },
    });
  }

  async updateOption(id, data) {
    return await this.db.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteOption(id) {
    return await this.db.delete({
      where: {
        id,
      },
    });
  }
}

module.exports = OptionModel;
