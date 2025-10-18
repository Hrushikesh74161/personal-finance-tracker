import { matchedData } from "express-validator";
import {
  createTransaction as createTransactionService,
  deleteTransaction as deleteTransactionService,
  getTransactionById as getTransactionByIdService,
  getTransactions as getTransactionsService,
  updateTransaction as updateTransactionService,
} from "../services/transactionService.js";
import { notFoundResponse } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle creating a new transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createTransaction(req, res) {
  try {
    const transactionData = matchedData(req);
    const userId = req.user.userId;

    // Call service to create transaction
    const transaction = await createTransactionService({
      ...transactionData,
      userId,
    });

    return createdResponse({ res, data: transaction });
  } catch (error) {
    console.error("Create transaction error:", error);

    if (error.message === "Transaction not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during transaction creation" } });
  }
}

/**
 * Handle getting a transaction by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getTransactionById(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get transaction
    const transaction = await getTransactionByIdService(id, userId);

    return response200({ res, data: transaction });
  } catch (error) {
    console.error("Get transaction error:", error);

    if (error.message === "Transaction not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching transaction" } });
  }
}

/**
 * Handle getting all transactions with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getTransactions(req, res) {
  try {
    const filters = matchedData(req);
    const userId = req.user.userId;

    // Call service to get transactions
    const result = await getTransactionsService(userId, filters);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Get transactions error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching transactions" } });
  }
}

/**
 * Handle updating a transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateTransaction(req, res) {
  try {
    const { id, ...updateData } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update transaction
    const transaction = await updateTransactionService(id, userId, updateData);

    return response200({ res, data: transaction });
  } catch (error) {
    console.error("Update transaction error:", error);

    if (error.message === "Transaction not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during transaction update" } });
  }
}

/**
 * Handle deleting a transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function deleteTransaction(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to delete transaction
    const result = await deleteTransactionService(id, userId);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Delete transaction error:", error);

    if (error.message === "Transaction not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during transaction deletion" } });
  }
}
