const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.user = { email: decodedToken.email };
  next();
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.isAdmin) {
    throw new Error("You are not an admin");
  } else {
    next();
  }
};

module.exports = { isAuth, isAdmin };
