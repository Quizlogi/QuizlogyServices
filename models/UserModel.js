const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient().$extends({
  // auto encrypt password
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if (["create", "update"].includes(operation) && args.data["password"]) {
          args.data["password"] = bcrypt.hashSync(args.data["password"], 10);
        }

        return query(args);
      },
    },
  },
});

class UserModel {
  constructor() {
    this.db = prisma.user;
  }

  /**
   * @param {number[]} roleId
   */
  async getUserByRoleId(roleId = []) {
    return await this.db.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        role_id: {
          in: roleId,
        },
      },
    });
  }

  /**
   * @param {number} userId
   */
  async getUserById(userId) {
    return await this.db.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  }

  /**
   *
   * @param {Object} data
   * @returns
   */
  async createUser(data) {
    return await this.db.create({
      data: {
        ...data,
        role_id: parseInt(data.role_id),
      },
    });
  }

  async updateUser(id, data) {
    return await this.db.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async deleteUser(id) {
    return await this.db.delete({
      where: {
        id,
      },
    });
  }
}

module.exports = UserModel;
