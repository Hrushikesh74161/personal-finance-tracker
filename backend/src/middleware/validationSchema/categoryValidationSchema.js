import { body, param, query } from "express-validator";

/**
 * Validation schema for creating a category
 * @returns {Array} Array of validation rules
 */
export const createCategoryValidationSchema = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("color")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex color code (e.g., #FF5733)")
    .isLength({ min: 7, max: 7 })
    .withMessage("Color must be exactly 7 characters"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Icon must not exceed 50 characters"),
];

/**
 * Validation schema for updating a category
 * @returns {Array} Array of validation rules
 */
export const updateCategoryValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("color")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex color code (e.g., #FF5733)")
    .isLength({ min: 7, max: 7 })
    .withMessage("Color must be exactly 7 characters"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Icon must not exceed 50 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

/**
 * Validation schema for getting a category by ID
 * @returns {Array} Array of validation rules
 */
export const getCategoryValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for deleting a category
 * @returns {Array} Array of validation rules
 */
export const deleteCategoryValidationSchema = [
  param("id")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ObjectId"),
];

/**
 * Validation schema for getting categories with filters
 * @returns {Array} Array of validation rules
 */
export const getCategoriesValidationSchema = [
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

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  query("sortBy")
    .optional()
    .trim()
    .isIn(["name", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: name, createdAt, updatedAt"),

  query("sortOrder")
    .optional()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];
