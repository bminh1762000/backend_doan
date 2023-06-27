const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .trim(),
  ],
  authController.login
);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.post(
  "/change-password",
  [
    body("oldPassword").trim().isLength({ min: 5 }),
    body("newPassword").trim().isLength({ min: 5 }),
    body("confirmPassword").trim().isLength({ min: 5 }),
  ],
  authController.changePassword
);

router.post("/login-admin", authController.loginAdmin);

module.exports = router;
