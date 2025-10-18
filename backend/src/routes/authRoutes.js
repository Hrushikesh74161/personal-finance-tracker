import express from "express";
import { login, signup } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginValidationSchema,
  signupValidationSchema
} from "../middleware/validationSchema/authValidationSchema.js";

const authRoutes = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
authRoutes.post("/signup", signupValidationSchema, validateRequest, signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
authRoutes.post("/login", loginValidationSchema, validateRequest, login);

export { authRoutes };
