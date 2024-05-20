const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
    constructor() {
        this.db = prisma.user;
    }

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
                        name: true
                    }
                }
            },
            where: {
                role_id: {
                    in: roleId
                }
            }
        });
    }

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
                        name: true
                    }
                }
            },
            where: {
                id: parseInt(userId)
            }
        });
    }
}

module.exports = UserModel;