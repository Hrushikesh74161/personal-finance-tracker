import { body, param, query } from "express-validator";

/**
 * Validation schema for creating a budget
 * @returns {Array} Array of validation rules
 */
export const createBudgetValidationSchema = [
  body("categoryId")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Budget name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Budget name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number")
    .toFloat(),

  body("period")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Period must be one of: weekly, monthly, quarterly, yearly"),

  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date")
    .toDate(),

  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .toDate(),
];

/**
 * Validation schema for updating a budget
 * @returns {Array} Array of validation rules
 */
export const updateBudgetValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Budget ID must be a valid MongoDB ObjectId"),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Budget name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number")
    .toFloat(),

  body("period")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Period must be one of: weekly, monthly, quarterly, yearly"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .toDate(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

/**
 * Validation schema for getting a budget by ID
 * @returns {Array} Array of validation rules
 */
export const getBudgetValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Budget ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for deleting a budget
 * @returns {Array} Array of validation rules
 */
export const deleteBudgetValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Budget ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for getting budgets with filters
 * @returns {Array} Array of validation rules
 */
export const getBudgetsValidationSchema = [
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

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive filter must be a boolean value"),

  query("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  query("period")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Period must be one of: weekly, monthly, quarterly, yearly"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  query("sortBy")
    .optional()
    .trim()
    .isIn(["name", "amount", "period", "startDate", "endDate", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: name, amount, period, startDate, endDate, createdAt, updatedAt"),

  query("sortOrder")
    .optional()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];
