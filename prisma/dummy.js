const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const asy = async () => {
    const category = await prisma.category.create({
        data: {
            name: 'Dasar'
        }
    });

    const quiz = await prisma.quiz.create({
        data: {
            title: 'Test Title',
            description: 'Belajar',
            category_id: category.id
        }
    })

    const question = await prisma.question.create({
        data: {
            question: 'ini test',
            quiz_id: quiz.id
        }
    });

    const options = await prisma.option.createMany({
        data: [
            {
                option: 'many year',
                is_correct: true,
                question_id: question.id
            },
            {
                option: 'many month',
                is_correct: false,
                question_id: question.id
            },
            {
                option: 'many day',
                is_correct: false,
                question_id: question.id
            }
        ]
    });
}

asy();