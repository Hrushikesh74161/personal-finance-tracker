import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Created user data
 */
export async function signup(userData) {
  const { firstName, lastName, email, password } = userData;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email, deleted: false });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  // Return user data without password
  const userResponse = {
    id: savedUser._id,
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    email: savedUser.email,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  };

  return userResponse;
}

/**
 * Authenticate user login
 * @param {Object} loginData - User login data
 * @param {string} loginData.email - User's email
 * @param {string} loginData.password - User's password
 * @returns {Promise<Object>} User data and JWT token
 */
export async function login(loginData) {
  const { email, password } = loginData;

  // Find user by email and include password field
  const user = await userModel.findOne({ email, deleted: false }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    process.env.JWT_SECRET_KEY || "your-secret-key",
    {
      expiresIn: "24h"
    }
  );

  // Return user data without password and token
  const userResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userResponse,
    token,
  };
}
