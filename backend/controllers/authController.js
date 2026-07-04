const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../singleton/logger");
const UserFactory = require("../factory/userFactory");

// Create a login token that lasts for 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  try {
    // Decide which user type to create
    const userType = email.endsWith("@admin.grocery.com")
      ? "admin"
      : "customer";

    // Create the user using the Factory Pattern
    const newUser = UserFactory.createUser(userType, {
      name,
      email,
      phone,
      address,
      password,
    });

    // Save the user to MongoDB
    const user = await User.create(newUser);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      membershipType: user.membershipType,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Singleton Logger
      logger.log(
        "LOGIN",
        `${user.email} logged into the system`
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        membershipType: user.membershipType,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      membershipType: user.membershipType,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update logged-in user's profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email, phone, address } = req.body;

    // Update only the fields that were provided
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      membershipType: updatedUser.membershipType,
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
};