const { Request, ResponseToolkit } = require("@hapi/hapi");
const fs = require("fs");
const QuizModel = require("../models/QuizModel");
const { JSONParse } = require("../utils");
const CategoryModel = require("../models/CategoryModel");

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

    const buffer = Buffer.from(image, "base64");
    fs.writeFileSync(`uploads/${now}.png`, buffer);

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

module.exports = {
  getAllCategory,
  getCategory,
  createCategory,
  editCategory,
  removeCategory,
  createQuiz,
  editQuiz,
  allQuiz,
  quizDetail,
};
