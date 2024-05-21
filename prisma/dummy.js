const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const asy = async () => {
    const numberOfCategories = 10;
    const numberOfQuizzesPerCategory = 5;
    const numberOfQuestionsPerQuiz = 10;
    const numberOfOptionsPerQuestion = 4;
    const numberOfUsers = 10;

    for (let i = 0; i < numberOfCategories; i++) {
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

    for (let i = 0; i < numberOfUsers; i++) {
        const userQuiz = await prisma.userQuiz.create({
            data: {
                user_id: i + 1, // Assign a user ID
                quiz_id: Math.floor(Math.random() * numberOfCategories * numberOfQuizzesPerCategory) + 1, // Assign a random quiz ID
                score: 0
            }
        });

        const options = await prisma.option.findMany({
            where: {
                question_id: Math.floor(Math.random() * numberOfCategories * numberOfQuizzesPerCategory * numberOfQuestionsPerQuiz) + 1 // Assign a random question ID
            }
        });

        await prisma.userAnswer.create({
            data: {
                user_quiz_id: userQuiz.id,
                question_id: Math.floor(Math.random() * numberOfCategories * numberOfQuizzesPerCategory * numberOfQuestionsPerQuiz) + 1, // Assign a random question ID
                option_id: options[Math.floor(Math.random() * options.length)].id
            }
        });

        // Update userQuiz score
        const userAnswers = await prisma.userAnswer.findMany({
            where: {
                user_quiz_id: userQuiz.id
            }
        });

        let score = 0;
        for (const userAnswer of userAnswers) {
            const option = await prisma.option.findUnique({
                where: {
                    id: userAnswer.option_id
                }
            });

            if (option.is_correct) {
                score += 1;
            }
        }

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