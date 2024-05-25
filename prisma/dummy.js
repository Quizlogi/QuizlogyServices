const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const asy = async () => {
    const numberOfCategories = 10;
    const numberOfQuizzesPerCategory = 5;
    const numberOfQuestionsPerQuiz = 10;
    const numberOfOptionsPerQuestion = 4;
    const numberOfUsers = 10;

    const instructures = await prisma.user.findMany({ where: { role_id: 2 } });
    for (let i = 0; i < numberOfCategories; i++) {
        const instructure = instructures[Math.floor(Math.random() * instructures.length)];

        const category = await prisma.category.create({
            data: {
                name: faker.lorem.words(2) // Generate a random category name
            }
        });

        for (let j = 0; j < numberOfQuizzesPerCategory; j++) {
            const quiz = await prisma.quiz.create({
                data: {
                    title: faker.lorem.words(5), // Generate a random quiz title
                    description: faker.lorem.sentence(), // Generate a random quiz description
                    image: faker.image.imageUrl(), // Generate a random image URL
                    user_id: instructure.id,
                    category_id: category.id
                }
            });

            for (let k = 0; k < numberOfQuestionsPerQuiz; k++) {
                const question = await prisma.question.create({
                    data: {
                        question: faker.lorem.sentence(), // Generate a random question
                        quiz_id: quiz.id
                    }
                });

                const options = [];
                for (let l = 0; l < numberOfOptionsPerQuestion; l++) {
                    options.push({
                        option: faker.lorem.words(3), // Generate a random option
                        is_correct: l === 0, // Make the first option the correct one
                        question_id: question.id
                    });
                }

                await prisma.option.createMany({
                    data: options
                });
            }
        }
    }

    const users = await prisma.user.findMany({ where: { role_id: 3 } });
    const quizzes = await prisma.quiz.findMany();
    for (let i = 0; i < numberOfUsers; i++) {
        const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        const user_id = users[Math.floor(Math.random() * users.length)].id;

        const userQuiz = await prisma.userQuiz.create({
            data: {
                user_id: user_id,
                quiz_id: quiz.id,
                score: 0
            }
        });

        const questions = await prisma.question.findMany({
            where: {
                quiz_id: quiz.id
            }
        });

        let correctAnswers = 0;
        for (let j = 0; j < questions.length; j++) {
            const options = await prisma.option.findMany({
                where: {
                    question_id: questions[j].id
                }
            });

            const userQuestion = await prisma.userAnswer.create({
                data: {
                    user_quiz_id: userQuiz.id,
                    question_id: questions[j].id,
                    option_id: options[Math.floor(Math.random() * options.length)].id
                }
            });

            const selectedOption = options.find(option => option.id === userQuestion.option_id);
            if (selectedOption.is_correct) {
                correctAnswers++;
            }
        }

        const score = (correctAnswers / questions.length) * 100;

        await prisma.userQuiz.update({
            where: {
                id: userQuiz.id
            },
            data: {
                score: score
            }
        });
    }
}

asy();