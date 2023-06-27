const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    if (!users) {
      const error = new Error("Could not find users");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Successfully", users: users });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateStatusUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { isLocked } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User could not find.");
      error.status = 404;
      throw error;
    }
    user.isLocked = isLocked;
    const result = await user.save();
    res.status(200).json({ message: "User updated", user: result });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User could not find.");
      error.status = 404;
      throw error;
    }
    await User.findByIdAndRemove(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User could not find.");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      message: "User info",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User could not find.");
      error.status = 404;
      throw error;
    }
    user.name = name;
    await user.save();
    res.status(200).json({ message: "User updated", isSuccess: true });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
