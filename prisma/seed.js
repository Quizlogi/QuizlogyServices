const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
    // create role user, inspector, admin
    await prisma.role.createMany({
        data: [
            { name: 'user' },
            { name: 'inspector' },
            { name: 'admin' }
        ]
    });

    // create user
    await prisma.user.create({
        data: {
            email: 'admin@mail.com',
            password: 'admin',
            username: 'admin',
            role_id: 3
        }
    });
}

seed();