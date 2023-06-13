const express = require("express");

const userController = require("../controllers/user");

const route = express.Router();

route.get("/", userController.getUsers);

route.put("/:userId", userController.updateUser);

route.delete("/:userId", userController.deleteUser);

module.exports = route;
