const express = require("express");

const userController = require("../controllers/user");
const { isAuth } = require("../middleware/is-auth");

const route = express.Router();

route.get("/all-users", userController.getUsers);

route.put("/:userId", userController.updateStatusUser);

route.delete("/:userId", userController.deleteUser);

route.get("/get-info", isAuth, userController.getUserInfo);

route.post("/update-info", isAuth, userController.updateUserInfo);

module.exports = route;
