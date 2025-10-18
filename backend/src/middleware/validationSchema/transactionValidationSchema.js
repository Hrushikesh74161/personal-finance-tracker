import { body, param, query } from "express-validator";

/**
 * Validation schema for creating a transaction
 * @returns {Array} Array of validation rules
 */
export const createTransactionValidationSchema = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["expense", "income", "transfer", "adjustment"])
    .withMessage("Transaction type must be one of: expense, income, transfer, adjustment"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Category must be between 1 and 100 characters"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a valid number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be greater than or equal to 0"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date format")
    .toDate(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      return true;
    }),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),

  body("paymentMethod")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Payment method must not exceed 100 characters"),

];

/**
 * Validation schema for updating a transaction
 * @returns {Array} Array of validation rules
 */
export const updateTransactionValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Transaction ID must be a valid MongoDB ObjectId"),

  body("type")
    .optional()
    .trim()
    .isIn(["expense", "income", "transfer", "adjustment"])
    .withMessage("Transaction type must be one of: expense, income, transfer, adjustment"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category must be between 1 and 100 characters"),

  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a valid number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be greater than or equal to 0"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date format")
    .toDate(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error("Maximum 10 tags allowed");
      }
      return true;
    }),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),

  body("paymentMethod")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Payment method must not exceed 100 characters"),

];

/**
 * Validation schema for getting a transaction by ID
 * @returns {Array} Array of validation rules
 */
export const getTransactionValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Transaction ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for deleting a transaction
 * @returns {Array} Array of validation rules
 */
export const deleteTransactionValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Transaction ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for getting transactions with filters
 * @returns {Array} Array of validation rules
 */
export const getTransactionsValidationSchema = [
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
    .isIn(["expense", "income", "transfer", "adjustment"])
    .withMessage("Type filter must be one of: expense, income, transfer, adjustment"),

  query("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category filter must be between 1 and 100 characters"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date format"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date format"),

  query("minAmount")
    .optional()
    .isNumeric()
    .withMessage("Minimum amount must be a valid number")
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be greater than or equal to 0"),

  query("maxAmount")
    .optional()
    .isNumeric()
    .withMessage("Maximum amount must be a valid number")
    .isFloat({ min: 0 })
    .withMessage("Maximum amount must be greater than or equal to 0"),

  query("sortBy")
    .optional()
    .trim()
    .isIn(["date", "amount", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: date, amount, createdAt, updatedAt"),

  query("sortOrder")
    .optional()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];
