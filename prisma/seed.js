const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const seed = async () => {
    console.log('Seeding database...');

    // create role user, inspector, admin
    await prisma.role.createMany({
        data: [
            { name: 'user' },
            { name: 'inspector' },
            { name: 'admin' }
        ]
    });

    await prisma.user.create({
        data: {
            email: 'admin@mail.com',
            password: 'admin',
            username: 'admin',
            role_id: 3
        }
    });

    await prisma.user.create({
        data: {
            email: 'inst@mail.com',
            password: 'inst',
            username: 'inst',
            role_id: 2
        }
    });

    await prisma.user.create({
        data: {
            email: 'kato@mail.com',
            password: 'kato',
            username: 'kato',
            name: 'Kato',
            role_id: 1
        }
    });

    const fakerUser = () => {
        return {
            email: faker.internet.email(),
            name: faker.name.fullName(),
            username: faker.internet.userName(),
            password: 'password',
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