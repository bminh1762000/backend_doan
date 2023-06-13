const mongoose = require("mongoose");

// Define the login attempts schema
const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  failedAttempts: {
    type: Number,
    default: 0,
  },
  lastFailedAttempt: Date,
});

module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);
