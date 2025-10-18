import { body, param, query } from "express-validator";

/**
 * Validation schema for creating an account
 * @returns {Array} Array of validation rules
 */
export const createAccountValidationSchema = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Account name is required")
    .isLength({ min: 1, max: 256 })
    .withMessage("Account name must be between 1 and 256 characters"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["checking", "savings", "creditCard", "cash", "other"])
    .withMessage("Account type must be one of: checking, savings, creditCard, cash, other"),

  body("balance")
    .optional()
    .isNumeric()
    .withMessage("Balance must be a valid number")
    .isFloat()
    .withMessage("Balance must be a valid number"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Account number must not exceed 50 characters"),

];

/**
 * Validation schema for updating an account
 * @returns {Array} Array of validation rules
 */
export const updateAccountValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage("Account name must be between 1 and 256 characters"),

  body("type")
    .optional()
    .trim()
    .isIn(["checking", "savings", "creditCard", "cash", "other"])
    .withMessage("Account type must be one of: checking, savings, creditCard, cash, other"),

  body("balance")
    .optional()
    .isNumeric()
    .withMessage("Balance must be a valid number")
    .isFloat()
    .withMessage("Balance must be a valid number"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("accountNumber")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Account number must not exceed 50 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),

];

/**
 * Validation schema for getting an account by ID
 * @returns {Array} Array of validation rules
 */
export const getAccountValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for deleting an account
 * @returns {Array} Array of validation rules
 */
export const deleteAccountValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for getting accounts with filters
 * @returns {Array} Array of validation rules
 */
export const getAccountsValidationSchema = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("type")
    .optional()
    .trim()
    .isIn(["checking", "savings", "creditCard", "cash", "other"])
    .withMessage("Type filter must be one of: checking, savings, creditCard, cash, other"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive filter must be a boolean value"),

  query("minBalance")
    .optional()
    .isNumeric()
    .withMessage("Minimum balance must be a valid number")
    .isFloat()
    .withMessage("Minimum balance must be a valid number"),

  query("maxBalance")
    .optional()
    .isNumeric()
    .withMessage("Maximum balance must be a valid number")
    .isFloat()
    .withMessage("Maximum balance must be a valid number"),

  query("sortBy")
    .optional()
    .trim()
    .isIn(["name", "type", "balance", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: name, type, balance, createdAt, updatedAt"),

  query("sortOrder")
    .optional()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];
