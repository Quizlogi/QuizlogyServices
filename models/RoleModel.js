const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class RoleModel {
  constructor() {
    this.db = prisma.role;
  }
}

module.exports = RoleModel;
