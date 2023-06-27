const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/user");
const LoginAttempt = require("../models/loginAttempt");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      throw error;
    }
    const email = req.body.email;
    const username = req.body.name;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: username,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    const newUser = await user.save();
    res.status(201).json({
      userId: newUser._id,
      email: email,
      displayName: username,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    let loginAttempt = await LoginAttempt.findOne({ email: email });
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Incorrect email or password.");
      error.statusCode = 404;
      throw error;
    }

    if (!loginAttempt) {
      // If the user does not exist, insert a new document
      loginAttempt = new LoginAttempt({ email });
    }

    const equal = await bcrypt.compare(password, user.password);
    if (!equal && loginAttempt.failedAttempts < 5) {
      loginAttempt.failedAttempts++;
      loginAttempt.lastFailedAttempt = new Date();
      await loginAttempt.save();
      const error = new Error("Incorrect email or password.");
      error.statusCode = 401;
      throw error;
    }

    if (loginAttempt && loginAttempt.failedAttempts >= 5 && !equal) {
      const lockoutPeriod = 5 * 60 * 1000; // 5 minutes
      const lastFailedAttempt = new Date(
        loginAttempt.lastFailedAttempt
      ).getTime();
      const currentTime = new Date().getTime();

      if (currentTime - lastFailedAttempt < lockoutPeriod) {
        // If the user is still locked out, return an error response
        return res.status(401).json({
          message: "Too many failed login attempts. Please try again later.",
        });
      } else {
        // If the lockout period has expired, reset the failed attempts count
        loginAttempt.failedAttempts = 0;
      }
    }

    await LoginAttempt.deleteOne({ email });
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    let loginAttempt = await LoginAttempt.findOne({ email: email });
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Incorrect email or password.");
      error.statusCode = 404;
      throw error;
    }

    if (!user.isAdmin) {
      const error = new Error("Incorrect email or password.");
      error.statusCode = 403;
      throw error;
    }

    if (!loginAttempt) {
      // If the user does not exist, insert a new document
      loginAttempt = new LoginAttempt({ email });
    }

    const equal = await bcrypt.compare(password, user.password);
    if (!equal && loginAttempt.failedAttempts < 5) {
      loginAttempt.failedAttempts++;
      loginAttempt.lastFailedAttempt = new Date();
      await loginAttempt.save();
      const error = new Error("Incorrect email or password.");
      error.statusCode = 401;
      throw error;
    }

    if (loginAttempt && loginAttempt.failedAttempts >= 5 && !equal) {
      const lockoutPeriod = 5 * 60 * 1000; // 5 minutes
      const lastFailedAttempt = new Date(
        loginAttempt.lastFailedAttempt
      ).getTime();
      const currentTime = new Date().getTime();

      if (currentTime - lastFailedAttempt < lockoutPeriod) {
        // If the user is still locked out, return an error response
        return res.status(401).json({
          message: "Too many failed login attempts. Please try again later.",
        });
      } else {
        // If the lockout period has expired, reset the failed attempts count
        loginAttempt.failedAttempts = 0;
      }
    }

    await LoginAttempt.deleteOne({ email });
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Generate unique token and store in user's MongoDB document
    const otpCode = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });
    await User.findOneAndUpdate(
      { email },
      { resetPasswordOtp: otpCode },
      { useFindAndModify: false }
    );

    const mailOptions = {
      from: "minhvb@mor.com.vn",
      to: email,
      subject: "Optcode for resetting your password",
      text: `Your optcode is ${otpCode}`,
    };
    const response = await sgMail.send(mailOptions);

    res.status(200).json({
      isSuccess: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res) => {
  const { optCode, password } = req.body;

  try {
    // Find user with matching reset password token
    const user = await User.findOne({ resetPasswordOtp: optCode });

    // If user not found, return error
    if (!user) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid reset password token" });
    }

    // Hash new password and update user document
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();

    res
      .status(200)
      .json({ isSuccess: true, message: "Password reset successful" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.userId;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    const equal = await bcrypt.compare(oldPassword, user.password);
    if (!equal) {
      const error = new Error("Incorrect password.");
      error.statusCode = 401;
      throw error;
    }
    if (newPassword !== confirmPassword) {
      const error = new Error("Passwords do not match.");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
