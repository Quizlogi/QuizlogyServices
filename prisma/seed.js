const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
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

const seed = async () => {
  console.log("Seeding database...");

  // create role user, inspector, admin
  await prisma.role.createMany({
    data: [{ name: "user" }, { name: "inspector" }, { name: "admin" }],
  });

  await prisma.user.create({
    data: {
      email: "admin@quizlogy.xyz",
      password: "admin",
      username: "admin",
      name: "Admin",
      role_id: 3,
    },
  });

  await prisma.user.create({
    data: {
      email: "instructure@quizlogy.xyz",
      password: "instructure",
      username: "instructure",
      name: "Instructure",
      role_id: 2,
    },
  });

  await prisma.user.create({
    data: {
      email: "user@quizlogy.xyz",
      password: "user",
      username: "user",
      name: "user",
      role_id: 1,
    },
  });

  const fakerUser = () => {
    return {
      email: faker.internet.email(),
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      password: "password",
      role_id: 1,
    };
  };

  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: fakerUser(),
    });
  }
};

seed();
