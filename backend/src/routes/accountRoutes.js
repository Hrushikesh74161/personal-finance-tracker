import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
  getAccountBalanceSummary,
} from "../controllers/accountController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createAccountValidationSchema,
  deleteAccountValidationSchema,
  getAccountsValidationSchema,
  getAccountValidationSchema,
  updateAccountValidationSchema,
} from "../middleware/validationSchema/accountValidationSchema.js";
import { verifyToken } from "../middleware/verifyToken.js";

const accountRoutes = express.Router();

// Apply authentication middleware to all account routes
accountRoutes.use(verifyToken);

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Private
 */
accountRoutes.post("/", createAccountValidationSchema, validateRequest, createAccount);

/**
 * @route   GET /api/accounts
 * @desc    Get all accounts with optional filters and pagination
 * @access  Private
 */
accountRoutes.get("/", getAccountsValidationSchema, validateRequest, getAccounts);

/**
 * @route   GET /api/accounts/summary
 * @desc    Get account balance summary
 * @access  Private
 */
accountRoutes.get("/summary", getAccountBalanceSummary);

/**
 * @route   GET /api/accounts/:id
 * @desc    Get a specific account by ID
 * @access  Private
 */
accountRoutes.get("/:id", getAccountValidationSchema, validateRequest, getAccountById);

/**
 * @route   PATCH /api/accounts/:id
 * @desc    Update a specific account
 * @access  Private
 */
accountRoutes.patch("/:id", updateAccountValidationSchema, validateRequest, updateAccount);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Delete a specific account (soft delete)
 * @access  Private
 */
accountRoutes.delete("/:id", deleteAccountValidationSchema, validateRequest, deleteAccount);

export { accountRoutes };
