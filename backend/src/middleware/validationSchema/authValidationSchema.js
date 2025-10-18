import { body } from "express-validator";

/**
 * Validation schema for user signup
 * @returns {Array} Array of validation rules
 */
export const signupValidationSchema = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("First name must be between 1 and 255 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Last name must not exceed 255 characters")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 25 })
    .withMessage("Password must be between 8 and 25 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];

/**
 * Validation schema for user login
 * @returns {Array} Array of validation rules
 */
export const loginValidationSchema = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];
