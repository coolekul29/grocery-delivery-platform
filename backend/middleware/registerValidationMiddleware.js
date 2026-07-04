const User = require("../models/User");

const checkRequiredFields = (req, res, next) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  next();
};

const checkEmailFormat = (req, res, next) => {
  const { email } = req.body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

const checkPasswordLength = (req, res, next) => {
  const { password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 chars",
    });
  }

  next();
};

const checkDuplicateUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkRequiredFields,
  checkEmailFormat,
  checkPasswordLength,
  checkDuplicateUser,
};