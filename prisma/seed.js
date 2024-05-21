const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

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

    const fakerUser = () => {
        return {
            email: faker.internet.email(),
            name: faker.name.fullName(),
            username: faker.internet.userName(),
            password: bcrypt.hashSync('password', 10),
            role_id: 1
        }
    }

    for (let i = 0; i < 100; i++) {
        await prisma.user.create({
            data: fakerUser()
        });
    }
}

seed();