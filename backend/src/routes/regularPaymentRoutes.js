import express from "express";
import {
  createRegularPayment,
  deleteRegularPayment,
  getRegularPaymentById,
  getRegularPayments,
  updateRegularPayment,
  getRegularPaymentStats,
  getUpcomingPayments,
  updateNextDueDate,
} from "../controllers/regularPaymentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createRegularPaymentValidationSchema,
  deleteRegularPaymentValidationSchema,
  getRegularPaymentsValidationSchema,
  getRegularPaymentValidationSchema,
  updateRegularPaymentValidationSchema,
  getUpcomingPaymentsValidationSchema,
  updateNextDueDateValidationSchema,
} from "../middleware/validationSchema/regularPaymentValidationSchema.js";
import { verifyToken } from "../middleware/verifyToken.js";

const regularPaymentRoutes = express.Router();

// Apply authentication middleware to all regular payment routes
regularPaymentRoutes.use(verifyToken);

/**
 * @route   POST /api/regular-payments
 * @desc    Create a new regular payment
 * @access  Private
 */
regularPaymentRoutes.post("/", createRegularPaymentValidationSchema, validateRequest, createRegularPayment);

/**
 * @route   GET /api/regular-payments
 * @desc    Get all regular payments with optional filters and pagination
 * @access  Private
 */
regularPaymentRoutes.get("/", getRegularPaymentsValidationSchema, validateRequest, getRegularPayments);

/**
 * @route   GET /api/regular-payments/stats
 * @desc    Get regular payment statistics
 * @access  Private
 */
regularPaymentRoutes.get("/stats", getRegularPaymentStats);

/**
 * @route   GET /api/regular-payments/upcoming
 * @desc    Get upcoming regular payments
 * @access  Private
 */
regularPaymentRoutes.get("/upcoming", getUpcomingPaymentsValidationSchema, validateRequest, getUpcomingPayments);

/**
 * @route   GET /api/regular-payments/:id
 * @desc    Get a specific regular payment by ID
 * @access  Private
 */
regularPaymentRoutes.get("/:id", getRegularPaymentValidationSchema, validateRequest, getRegularPaymentById);

/**
 * @route   PATCH /api/regular-payments/:id
 * @desc    Update a specific regular payment
 * @access  Private
 */
regularPaymentRoutes.patch("/:id", updateRegularPaymentValidationSchema, validateRequest, updateRegularPayment);

/**
 * @route   PATCH /api/regular-payments/:id/next-due-date
 * @desc    Update next due date for a regular payment
 * @access  Private
 */
regularPaymentRoutes.patch("/:id/next-due-date", updateNextDueDateValidationSchema, validateRequest, updateNextDueDate);

/**
 * @route   DELETE /api/regular-payments/:id
 * @desc    Delete a specific regular payment (soft delete)
 * @access  Private
 */
regularPaymentRoutes.delete("/:id", deleteRegularPaymentValidationSchema, validateRequest, deleteRegularPayment);

export { regularPaymentRoutes };
