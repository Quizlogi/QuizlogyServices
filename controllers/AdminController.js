const { Request, ResponseToolkit } = require("@hapi/hapi");
const UserModel = require("../models/UserModel");

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

    const updatedUser = await User.updateUser(userId, {
      ...payload,
    });

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

module.exports = {
  insertUser,
  getUser,
  getUserById,
  updateUser,
  removeUser,
};
