import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  getCategoryStats,
} from "../controllers/categoryController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createCategoryValidationSchema,
  deleteCategoryValidationSchema,
  getCategoriesValidationSchema,
  getCategoryValidationSchema,
  updateCategoryValidationSchema,
} from "../middleware/validationSchema/categoryValidationSchema.js";
import { verifyToken } from "../middleware/verifyToken.js";

const categoryRoutes = express.Router();

// Apply authentication middleware to all category routes
categoryRoutes.use(verifyToken);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private
 */
categoryRoutes.post("/", createCategoryValidationSchema, validateRequest, createCategory);

/**
 * @route   GET /api/categories
 * @desc    Get all categories with optional filters and pagination
 * @access  Private
 */
categoryRoutes.get("/", getCategoriesValidationSchema, validateRequest, getCategories);

/**
 * @route   GET /api/categories/stats
 * @desc    Get category statistics
 * @access  Private
 */
categoryRoutes.get("/stats", getCategoryStats);

/**
 * @route   GET /api/categories/:id
 * @desc    Get a specific category by ID
 * @access  Private
 */
categoryRoutes.get("/:id", getCategoryValidationSchema, validateRequest, getCategoryById);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update a specific category
 * @access  Private
 */
categoryRoutes.patch("/:id", updateCategoryValidationSchema, validateRequest, updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a specific category (soft delete)
 * @access  Private
 */
categoryRoutes.delete("/:id", deleteCategoryValidationSchema, validateRequest, deleteCategory);

export { categoryRoutes };
