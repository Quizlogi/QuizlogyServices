const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoryModel {
  constructor() {
    this.db = prisma.category;
  }

  async getCategory() {
    const category = await this.db.findMany({
      include: {
        _count: {
          select: {
            quiz: true,
          },
        },
      },
    });
    
    return category;
  }

  async createCategory(data) {
    const category = await this.db.create({
      data: {
        ...data,
      },
    });

    return category;
  }
}

module.exports = CategoryModel;
