const { Request, ResponseToolkit } = require("@hapi/hapi");
const UserModel = require("../models/UserModel");
const RoleModel = require("../models/RoleModel");
const CategoryModel = require("../models/CategoryModel");

/**
 *
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns
 */
const getUser = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const auth = request.auth.credentials;

    const User = new UserModel();

    let roles = [];
    if (auth.role == 1 || auth.role == 2) roles = [1];
    else roles = [1, 2, 3];

    const users = await User.getUserByRoleId(roles);

    return h
      .response({
        message: "Success",
        data: users,
      })
      .code(200);
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
const insertUser = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const User = new UserModel();

    const payload = request.payload || {};

    if (
      !payload.username ||
      !payload.name ||
      !payload.email ||
      !payload.password ||
      !payload.role_id
    )
      return h
        .response({
          message: "Invalid payload",
        })
        .code(400);

    // check if email or username already exists
    const userExists = await User.db.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }],
      },
    });

    if (userExists)
      return h
        .response({
          message: "User already exists",
        })
        .code(409);

    await User.createUser({
      name: payload.name,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role_id: payload.role_id,
    });

    // get user
    const user = await User.db.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }],
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return h
      .response({
        message: "Success",
        data: user,
      })
      .code(201);
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
const getUserById = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const User = new UserModel();

    const userId = request.params.id;

    const user = await User.getUserById(userId);

    if (!user)
      return h
        .response({
          message: "User not found",
        })
        .code(404);

    if (
      request.auth.credentials.role === 1 &&
      (user.role_id === 2 || user.role_id === 3)
    ) {
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);
    }

    return h
      .response({
        message: "Success",
        data: user,
      })
      .code(200);
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
const updateUser = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const User = new UserModel();

    const userId = request.params.id;
    const user = await User.getUserById(userId);

    if (!user)
      return h
        .response({
          message: "User not found",
        })
        .code(404);

    if (
      request.auth.credentials.role === 1 &&
      (user.role_id === 2 || user.role_id === 3)
    ) {
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);
    }

    // check if already exists email or username
    const userExists = await User.db.findFirst({
      where: {
        OR: [
          { email: request.payload.email },
          { username: request.payload.username },
        ],
        NOT: {
          id: userId,
        },
      },
    });

    if (userExists)
      return h
        .response({
          message: "Email or username already exists",
        })
        .code(409);

    const payload = request.payload || {};

    await User.updateUser(userId, {
      ...payload,
    });

    const updatedUser = await User.getUserById(userId);

    return h
      .response({
        message: "Success",
        data: updatedUser,
      })
      .code(200);
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
const removeUser = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const User = new UserModel();

    const userId = request.params.id;
    const user = await User.getUserById(userId);

    if (!user)
      return h
        .response({
          message: "User not found",
        })
        .code(404);

    if (
      request.auth.credentials.role === 1 &&
      (user.role_id === 2 || user.role_id === 3)
    ) {
      return h
        .response({
          message: "Forbidden",
        })
        .code(403);
    }

    await User.deleteUser(userId);

    return h
      .response({
        message: "Success",
      })
      .code(200);
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
const getRoles = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const Role = new RoleModel();

    const roles = await Role.db.findMany();

    return h
      .response({
        message: "Success",
        data: roles,
      })
      .code(200);
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
const getRoleById = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const Role = new RoleModel();

    const roleId = request.params.id;
    const role = await Role.db.findFirst({
      where: {
        id: roleId,
      },
    });

    if (!role)
      return h
        .response({
          message: "Role not found",
        })
        .code(404);

    return h
      .response({
        message: "Success",
        data: role,
      })
      .code(200);
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
const updateRole = async (request, h) => {
  if (request.auth.credentials.role != 3)
    return h
      .response({
        message: "Forbidden",
      })
      .code(403);

  try {
    const Role = new RoleModel();

    const roleId = request.params.id;
    const role = await Role.db.findFirst({
      where: {
        id: parseInt(roleId),
      },
    });

    if (!role)
      return h
        .response({
          message: "Role not found",
        })
        .code(404);

    const payload = request.payload || {};

    await Role.db.update({
      where: {
        id: parseInt(roleId),
      },
      data: {
        ...payload,
      },
    });

    const updatedRole = await Role.db.findFirst({
      where: {
        id: parseInt(roleId),
      },
    });

    return h
      .response({
        message: "Success",
        data: updatedRole,
      })
      .code(200);
  } catch (err) {
    console.error(err);
  }
};

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
    if (credentials.role !== 3)
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

    // check if name already exists (case insensitive)
    const categoryExists = await Category.db.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    if (categoryExists)
      return h
        .response({
          message: "Category already exists",
        })
        .code(409);

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
const updateCategory = async (request, h) => {
  try {
    const { credentials } = request.auth;
    if (credentials.role !== 3)
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

    // check if name already exists (case insensitive)
    const categoryExists2 = await Category.db.findFirst({
      where: {
        name: {
          equals: name,
        },
        AND: {
          id: {
            not: id,
          },
        },
      },
    });

    if (categoryExists2)
      return h
        .response({
          message: "Category already exists",
        })
        .code(409);

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
    if (credentials.role !== 3)
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

module.exports = {
  insertUser,
  getUser,
  getUserById,
  updateUser,
  removeUser,
  getRoles,
  getRoleById,
  updateRole,
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  removeCategory,
};
