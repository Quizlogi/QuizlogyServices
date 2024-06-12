const { Request, ResponseToolkit } = require("@hapi/hapi");
const fs = require("fs");
const sharp = require("sharp");

const { JSONParse } = require("../utils");

const QuizModel = require("../models/QuizModel");
const CategoryModel = require("../models/CategoryModel");
const QuestionModel = require("../models/QuestionModel");
const OptionModel = require("../models/OptionModel");

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
const getAllCategory = async (request, h) => {
  try {
    const Category = new CategoryModel();

    const categories = await Category.getCategory();

    return h.response({
      message: "Success",
      data: categories,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getCategory = async (request, h) => {
  try {
    const Category = new CategoryModel();
    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const category = await Category.db.findUnique({
      where: {
        id,
      },
    });

    if (!category)
      return h
        .response({
          message: "Category not found",
        })
        .code(404);

    return h.response({
      message: "Success",
      data: category,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const createCategory = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Category = new CategoryModel();
    const { name } = request.payload;

    if (!name)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const category = await Category.createCategory({ name });

    return h.response({
      message: "Success",
      data: category,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const editCategory = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Category = new CategoryModel();
    const { id } = request.params;
    const { name } = request.payload;

    if (!id || !name)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // check if exists
    const categoryExists = await Category.db.findUnique({
      where: {
        id,
      },
    });
    if (!categoryExists)
      return h
        .response({
          message: "Category not found",
        })
        .code(404);

    const category = await Category.db.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return h.response({
      message: "Success",
      data: category,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const removeCategory = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Category = new CategoryModel();
    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // is
    const categoryExists = await Category.db.findUnique({
      where: {
        id,
      },
    });

    if (!categoryExists)
      return h
        .response({
          message: "Category not found",
        })
        .code(404);

    await Category.db.delete({
      where: {
        id,
      },
    });

    return h.response({
      message: "Success",
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
const createQuiz = async (request, h) => {
  const now = Date.now();
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Quiz = new QuizModel();
    const { quiz, image } = request.payload;

    if (!quiz || !image)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const json = JSONParse(quiz);
    if (typeof json !== "object")
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    if (!json.title || !json.description || !json.category_id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // save image
    const mime = image.split(";")[0].split(":")[1];
    const buffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const sharpImage = await sharp(buffer).toFormat("png").toBuffer();

    fs.writeFileSync(`uploads/${now}.png`, sharpImage);

    const quizData = await Quiz.createQuiz({
      ...json,
      image: `uploads/${now}.png`,
      user_id: credentials.id,
    });

    return h.response({ message: "Success", data: quizData });
  } catch (err) {
    fs.unlinkSync(`uploads/${now}.png`);
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
const allQuiz = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Quiz = new QuizModel();

    const quiz = await Quiz.db.findMany({
      include: {
        category: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return h.response({
      message: "Success",
      data: quiz,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const quizDetail = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Quiz = new QuizModel();
    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const quiz = await Quiz.db.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return h.response({
      message: "Success",
      data: quiz,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const editQuiz = async (request, h) => {
  const now = Date.now();
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Quiz = new QuizModel();

    const { id } = request.params;

    const data = await Quiz.db.findUnique({
      where: {
        id,
      },
    });

    if (!data)
      return h
        .response({
          message: "Quiz not found",
        })
        .code(404);

    const { quiz, image } = request.payload;

    if (!quiz)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const json = JSONParse(quiz);
    if (typeof json !== "object")
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    if (!json.title || !json.description || !json.category_id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    if (image) {
      const buffer = Buffer.from(image, "base64");
      fs.writeFileSync(`uploads/${now}.png`, buffer);
    }

    const quizData = await Quiz.db.update({
      where: {
        id,
      },
      data: {
        ...json,
        image: image ? `uploads/${now}.png` : data.image,
      },
    });

    return h.response({ message: "Success", data: quizData });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
const removeQuiz = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Quiz = new QuizModel();
    const { id } = request.params;
    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const quiz = await Quiz.db.findUnique({
      where: {
        id,
      },
    });

    if (!quiz)
      return h
        .response({
          message: "Quiz not found",
        })
        .code(404);

    await Quiz.db.delete({
      where: {
        id,
      },
    });

    fs.unlinkSync(quiz.image);

    return h.response({
      message: "Success",
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getAllQuestion = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const { id } = request.params;

    const Question = new QuestionModel();

    const question = await Question.allQuestion(id);

    return h.response({
      message: "success get all question",
      data: question,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getQuestion = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Question = new QuestionModel();
    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const question = await Question.questionDetail(id);

    return h.response({
      message: "Success",
      data: question,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const createQuestion = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Question = new QuestionModel();
    const Quiz = new QuizModel();

    const { id } = request.params;
    const { question } = request.payload;

    if (!question)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // check quiz id exists
    const quizExists = await Quiz.db.findUnique({
      where: {
        id,
      },
    });

    if (!quizExists)
      return h
        .response({
          message: "Quiz not found",
        })
        .code(404);

    const data = await Question.createQuestion({
      question,
      quiz_id: id,
    });

    return h.response({
      message: "Success create question",
      data,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const editQuestion = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Question = new QuestionModel();

    const { id, questionId } = request.params;
    const { question } = request.payload;

    if (!id || !questionId || !question)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // check if quiz exists
    const quizExists = await Question.db.findFirst({
      where: {
        quiz_id: id,
      },
    });

    if (!quizExists)
      return h
        .response({
          message: "Quiz not found",
        })
        .code(404);

    const questionExists = await Question.db.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!questionExists)
      return h
        .response({
          message: "Question not found",
        })
        .code(404);

    const data = await Question.updateQuestion(questionId, {
      question,
    });

    return h.response({
      message: "Success update question",
      data,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const removeQuestion = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const Question = new QuestionModel();

    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const questionExists = await Question.db.findUnique({
      where: {
        id,
      },
    });

    if (!questionExists)
      return h
        .response({
          message: "Question not found",
        })
        .code(404);

    await Question.deleteQuestion(id);

    return h.response({
      message: "Success delete question",
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getAllOptions = async (request, h) => {
  try {
    const Option = new OptionModel();

    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const { id } = request.params;

    const options = await Option.allOption(id);

    return h.response({
      message: "Success",
      data: options,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getOption = async (request, h) => {
  try {
    const Option = new OptionModel();

    const { credentials } = request.auth;
    if (credentials.role !== 2)
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);

    const { id } = request.params;

    const option = await Option.optionDetail(id);

    return h.response({
      message: "Success",
      data: option,
    });
  } catch (err) {
    console.error(err);
  }
};

const createOption = async (request, h) => {
  try {
    const Option = new OptionModel();
    const Question = new QuestionModel();

    const { id } = request.params;
    const { option } = request.payload;

    if (!option || !id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const questionExists = await Question.db.findUnique({
      where: {
        id,
      },
    });

    if (!questionExists)
      return h
        .response({
          message: "Question not found",
        })
        .code(404);

    const data = await Option.createOption({
      option,
      question_id: id,
    });

    return h.response({
      message: "Success create option",
      data,
    });
  } catch (err) {
    console.error(err);
  }
};

const editOption = async (request, h) => {
  try {
    const Option = new OptionModel();
    const Question = new QuestionModel();

    const { id, optionId } = request.params;
    const { option, is_correct } = request.payload;

    if (!option || !id || !optionId)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const questionExists = await Question.db.findUnique({
      where: {
        id,
      },
    });

    if (!questionExists)
      return h
        .response({
          message: "Question not found",
        })
        .code(404);

    const optionExists = await Option.db.findUnique({
      where: {
        id: optionId,
      },
    });

    if (!optionExists)
      return h
        .response({
          message: "Option not found",
        })
        .code(404);

    const data = await Option.updateOption(optionId, {
      option,
      is_correct,
    });

    await Option.db.updateMany({
      where: {
        question_id: id,
        id: {
          not: optionId,
        },
      },
      data: {
        is_correct: false,
      },
    });

    return h.response({
      message: "Success update option",
      data,
    });
  } catch (err) {
    console.error(err);
  }
};

const removeOption = async (request, h) => {
  try {
    const Option = new OptionModel();

    const { id } = request.params;

    if (!id)
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    const optionExists = await Option.db.findUnique({
      where: {
        id,
      },
    });

    if (!optionExists)
      return h
        .response({
          message: "Option not found",
        })
        .code(404);

    await Option.deleteOption(id);

    return h.response({
      message: "Success delete option",
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAllCategory,
  getCategory,
  createCategory,
  editCategory,
  removeCategory,
  createQuiz,
  editQuiz,
  removeQuiz,
  allQuiz,
  quizDetail,
  getAllQuestion,
  getQuestion,
  createQuestion,
  editQuestion,
  removeQuestion,
  getAllOptions,
  getOption,
  createOption,
  editOption,
  removeOption,
};
