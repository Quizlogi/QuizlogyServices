const { ServerRoute, Refs } = require("@hapi/hapi");
const {
  getUser,
  getUserById,
  insertUser,
  updateUser,
  removeUser,
  getRoles,
  getRoleById,
  updateRole,
  getCategory,
  getAllCategory,
  createCategory,
  updateCategory,
} = require("../../controllers/AdminController");

/**
 * @type {ServerRoute<Refs>[]}
 */
module.exports = [
  {
    method: "GET",
    path: "/api/admin/users",
    config: {
      auth: "jwt",
      tags: ["main"],
    },
    handler: getUser,
  },
  {
    method: "GET",
    path: "/api/admin/users/{id}",
    config: {
      auth: "jwt",
      tags: ["main"],
    },
    handler: getUserById,
  },
  {
    method: "PUT",
    path: "/api/admin/users/{id}",
    config: {
      auth: "jwt",
      tags: ["main"],
    },
    handler: updateUser,
  },
  {
    method: "POST",
    path: "/api/admin/users",
    config: {
      auth: "jwt",
      tags: ["main"],
    },
    handler: insertUser,
  },
  {
    method: "DELETE",
    path: "/api/admin/users/{id}",
    config: {
      auth: "jwt",
    },
    handler: removeUser,
  },
  {
    method: "GET",
    path: "/api/admin/roles",
    config: {
      auth: "jwt",
    },
    handler: getRoles,
  },
  {
    method: "GET",
    path: "/api/admin/roles/{id}",
    config: {
      auth: "jwt",
    },
    handler: getRoleById,
  },
  {
    method: "PUT",
    path: "/api/admin/roles/{id}",
    config: {
      auth: "jwt",
    },
    handler: updateRole,
  },
  {
    method: "GET",
    path: "/api/admin/category",
    config: {
      auth: "jwt",
    },
    handler: getAllCategory,
  },
  {
    method: "GET",
    path: "/api/admin/category/{id}",
    config: {
      auth: "jwt",
    },
    handler: getCategory,
  },
  {
    method: "POST",
    path: "/api/admin/category",
    config: {
      auth: "jwt",
    },
    handler: createCategory,
  },
  {
    method: "PUT",
    path: "/api/admin/category/{id}",
    config: {
      auth: "jwt",
    },
    handler: updateCategory,
  },
];
