import { matchedData } from "express-validator";
import {
  createRegularPayment as createRegularPaymentService,
  deleteRegularPayment as deleteRegularPaymentService,
  getRegularPaymentById as getRegularPaymentByIdService,
  getRegularPayments as getRegularPaymentsService,
  updateRegularPayment as updateRegularPaymentService,
  getRegularPaymentStats as getRegularPaymentStatsService,
  getUpcomingPayments as getUpcomingPaymentsService,
  updateNextDueDate as updateNextDueDateService,
} from "../services/regularPaymentService.js";
import { notFoundResponse } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle creating a new regular payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createRegularPayment(req, res) {
  try {
    const paymentData = matchedData(req);
    const userId = req.user.userId;

    // Call service to create regular payment
    const payment = await createRegularPaymentService({
      ...paymentData,
      userId,
    });

    return createdResponse({ res, data: payment });
  } catch (error) {
    console.error("Create regular payment error:", error);

    if (error.message === "Regular payment not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Account not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Next due date must be in the future") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    if (error.message === "Next due date must be before end date") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during regular payment creation" } });
  }
}

/**
 * Handle getting a regular payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getRegularPaymentById(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get regular payment
    const payment = await getRegularPaymentByIdService(id, userId);

    return response200({ res, data: payment });
  } catch (error) {
    console.error("Get regular payment error:", error);

    if (error.message === "Regular payment not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching regular payment" } });
  }
}

/**
 * Handle getting all regular payments with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getRegularPayments(req, res) {
  try {
    const filters = matchedData(req);
    const userId = req.user.userId;

    // Call service to get regular payments
    const result = await getRegularPaymentsService(userId, filters);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Get regular payments error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching regular payments" } });
  }
}

/**
 * Handle updating a regular payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateRegularPayment(req, res) {
  try {
    const { id, ...updateData } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update regular payment
    const payment = await updateRegularPaymentService(id, userId, updateData);

    return response200({ res, data: payment });
  } catch (error) {
    console.error("Update regular payment error:", error);

    if (error.message === "Regular payment not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Account not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Next due date must be in the future") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    if (error.message === "Next due date must be before end date") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during regular payment update" } });
  }
}

/**
 * Handle deleting a regular payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function deleteRegularPayment(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to delete regular payment
    const result = await deleteRegularPaymentService(id, userId);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Delete regular payment error:", error);

    if (error.message === "Regular payment not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during regular payment deletion" } });
  }
}

/**
 * Handle getting regular payment statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getRegularPaymentStats(req, res) {
  try {
    const userId = req.user.userId;

    // Call service to get regular payment stats
    const stats = await getRegularPaymentStatsService(userId);

    return response200({ res, data: stats });
  } catch (error) {
    console.error("Get regular payment stats error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching regular payment statistics" } });
  }
}

/**
 * Handle getting upcoming regular payments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getUpcomingPayments(req, res) {
  try {
    const { days = 30 } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get upcoming payments
    const payments = await getUpcomingPaymentsService(userId, days);

    return response200({ res, data: payments });
  } catch (error) {
    console.error("Get upcoming payments error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching upcoming payments" } });
  }
}

/**
 * Handle updating next due date for a payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateNextDueDate(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update next due date
    const payment = await updateNextDueDateService(id, userId);

    return response200({ res, data: payment });
  } catch (error) {
    console.error("Update next due date error:", error);

    if (error.message === "Regular payment not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during next due date update" } });
  }
}
