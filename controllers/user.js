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

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { name } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User could not find.");
      error.status = 404;
      throw error;
    }
    user.name = name;
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
