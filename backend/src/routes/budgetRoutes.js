import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
  getBudgetStats,
  getCurrentBudgets,
} from "../controllers/budgetController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createBudgetValidationSchema,
  deleteBudgetValidationSchema,
  getBudgetsValidationSchema,
  getBudgetValidationSchema,
  updateBudgetValidationSchema,
} from "../middleware/validationSchema/budgetValidationSchema.js";
import { verifyToken } from "../middleware/verifyToken.js";

const budgetRoutes = express.Router();

// Apply authentication middleware to all budget routes
budgetRoutes.use(verifyToken);

/**
 * @route   POST /api/budgets
 * @desc    Create a new budget
 * @access  Private
 */
budgetRoutes.post("/", createBudgetValidationSchema, validateRequest, createBudget);

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets with optional filters and pagination
 * @access  Private
 */
budgetRoutes.get("/", getBudgetsValidationSchema, validateRequest, getBudgets);

/**
 * @route   GET /api/budgets/stats
 * @desc    Get budget statistics
 * @access  Private
 */
budgetRoutes.get("/stats", getBudgetStats);

/**
 * @route   GET /api/budgets/current
 * @desc    Get current active budgets
 * @access  Private
 */
budgetRoutes.get("/current", getCurrentBudgets);

/**
 * @route   GET /api/budgets/:id
 * @desc    Get a specific budget by ID
 * @access  Private
 */
budgetRoutes.get("/:id", getBudgetValidationSchema, validateRequest, getBudgetById);

/**
 * @route   PATCH /api/budgets/:id
 * @desc    Update a specific budget
 * @access  Private
 */
budgetRoutes.patch("/:id", updateBudgetValidationSchema, validateRequest, updateBudget);

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a specific budget (soft delete)
 * @access  Private
 */
budgetRoutes.delete("/:id", deleteBudgetValidationSchema, validateRequest, deleteBudget);

export { budgetRoutes };
