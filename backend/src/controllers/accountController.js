import { matchedData } from "express-validator";
import {
  createAccount as createAccountService,
  deleteAccount as deleteAccountService,
  getAccountById as getAccountByIdService,
  getAccounts as getAccountsService,
  updateAccount as updateAccountService,
  getAccountBalanceSummary as getAccountBalanceSummaryService,
} from "../services/accountService.js";
import { notFoundResponse } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle creating a new account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createAccount(req, res) {
  try {
    const accountData = matchedData(req);
    const userId = req.user.userId;

    // Call service to create account
    const account = await createAccountService({
      ...accountData,
      userId,
    });

    return createdResponse({ res, data: account });
  } catch (error) {
    console.error("Create account error:", error);

    if (error.message === "Account not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during account creation" } });
  }
}

/**
 * Handle getting an account by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getAccountById(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get account
    const account = await getAccountByIdService(id, userId);

    return response200({ res, data: account });
  } catch (error) {
    console.error("Get account error:", error);

    if (error.message === "Account not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching account" } });
  }
}

/**
 * Handle getting all accounts with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getAccounts(req, res) {
  try {
    const filters = matchedData(req);
    const userId = req.user.userId;

    // Call service to get accounts
    const result = await getAccountsService(userId, filters);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Get accounts error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching accounts" } });
  }
}

/**
 * Handle updating an account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateAccount(req, res) {
  try {
    const { id, ...updateData } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update account
    const account = await updateAccountService(id, userId, updateData);

    return response200({ res, data: account });
  } catch (error) {
    console.error("Update account error:", error);

    if (error.message === "Account not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during account update" } });
  }
}

/**
 * Handle deleting an account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function deleteAccount(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to delete account
    const result = await deleteAccountService(id, userId);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Delete account error:", error);

    if (error.message === "Account not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during account deletion" } });
  }
}

/**
 * Handle getting account balance summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getAccountBalanceSummary(req, res) {
  try {
    const userId = req.user.userId;

    // Call service to get balance summary
    const summary = await getAccountBalanceSummaryService(userId);

    return response200({ res, data: summary });
  } catch (error) {
    console.error("Get account balance summary error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching account balance summary" } });
  }
}
