const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

const User =  mongoose.model("User", userSchema);
module.exports = User;
