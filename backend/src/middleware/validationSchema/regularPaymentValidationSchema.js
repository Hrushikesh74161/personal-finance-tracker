import { body, param, query } from "express-validator";

/**
 * Validation schema for creating a regular payment
 * @returns {Array} Array of validation rules
 */
export const createRegularPaymentValidationSchema = [
  body("categoryId")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  body("accountId")
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Payment name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Payment name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number")
    .toFloat(),

  body("frequency")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Frequency must be one of: weekly, monthly, quarterly, yearly"),

  body("nextDueDate")
    .isISO8601()
    .withMessage("Next due date must be a valid ISO 8601 date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .toDate(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 0) {
        const invalidTags = tags.filter(tag => typeof tag !== 'string' || tag.trim().length === 0);
        if (invalidTags.length > 0) {
          throw new Error("All tags must be non-empty strings");
        }
      }
      return true;
    }),
];

/**
 * Validation schema for updating a regular payment
 * @returns {Array} Array of validation rules
 */
export const updateRegularPaymentValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Regular payment ID must be a valid MongoDB ObjectId"),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  body("accountId")
    .optional()
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Payment name must be between 1 and 100 characters"),

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

  body("frequency")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Frequency must be one of: weekly, monthly, quarterly, yearly"),

  body("nextDueDate")
    .optional()
    .isISO8601()
    .withMessage("Next due date must be a valid ISO 8601 date")
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

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags && tags.length > 0) {
        const invalidTags = tags.filter(tag => typeof tag !== 'string' || tag.trim().length === 0);
        if (invalidTags.length > 0) {
          throw new Error("All tags must be non-empty strings");
        }
      }
      return true;
    }),
];

/**
 * Validation schema for getting a regular payment by ID
 * @returns {Array} Array of validation rules
 */
export const getRegularPaymentValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Regular payment ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for deleting a regular payment
 * @returns {Array} Array of validation rules
 */
export const deleteRegularPaymentValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Regular payment ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for getting regular payments with filters
 * @returns {Array} Array of validation rules
 */
export const getRegularPaymentsValidationSchema = [
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

  query("accountId")
    .optional()
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB ObjectId"),

  query("frequency")
    .optional()
    .trim()
    .isIn(["weekly", "monthly", "quarterly", "yearly"])
    .withMessage("Frequency must be one of: weekly, monthly, quarterly, yearly"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  query("sortBy")
    .optional()
    .trim()
    .isIn(["name", "amount", "frequency", "nextDueDate", "endDate", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: name, amount, frequency, nextDueDate, endDate, createdAt, updatedAt"),

  query("sortOrder")
    .optional()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];

/**
 * Validation schema for getting upcoming payments
 * @returns {Array} Array of validation rules
 */
export const getUpcomingPaymentsValidationSchema = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365")
    .toInt(),
];

/**
 * Validation schema for updating next due date
 * @returns {Array} Array of validation rules
 */
export const updateNextDueDateValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Regular payment ID must be a valid MongoDB ObjectId"),
];
