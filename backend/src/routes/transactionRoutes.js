import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTransactionValidationSchema,
  deleteTransactionValidationSchema,
  getTransactionsValidationSchema,
  getTransactionValidationSchema,
  updateTransactionValidationSchema,
} from "../middleware/validationSchema/transactionValidationSchema.js";
import { verifyToken } from "../middleware/verifyToken.js";

const transactionRoutes = express.Router();

// Apply authentication middleware to all transaction routes
transactionRoutes.use(verifyToken);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
transactionRoutes.post("/", createTransactionValidationSchema, validateRequest, createTransaction);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with optional filters and pagination
 * @access  Private
 */
transactionRoutes.get("/", getTransactionsValidationSchema, validateRequest, getTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a specific transaction by ID
 * @access  Private
 */
transactionRoutes.get("/:id", getTransactionValidationSchema, validateRequest, getTransactionById);

/**
 * @route   PATCH /api/transactions/:id
 * @desc    Update a specific transaction
 * @access  Private
 */
transactionRoutes.patch("/:id", updateTransactionValidationSchema, validateRequest, updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a specific transaction (soft delete)
 * @access  Private
 */
transactionRoutes.delete("/:id", deleteTransactionValidationSchema, validateRequest, deleteTransaction);

export { transactionRoutes };
