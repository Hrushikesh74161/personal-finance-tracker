import { matchedData } from "express-validator";
import {
  createBudget as createBudgetService,
  deleteBudget as deleteBudgetService,
  getBudgetById as getBudgetByIdService,
  getBudgets as getBudgetsService,
  updateBudget as updateBudgetService,
  getBudgetStats as getBudgetStatsService,
  getCurrentBudgets as getCurrentBudgetsService,
} from "../services/budgetService.js";
import { notFoundResponse } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle creating a new budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createBudget(req, res) {
  try {
    const budgetData = matchedData(req);
    const userId = req.user.userId;

    // Call service to create budget
    const budget = await createBudgetService({
      ...budgetData,
      userId,
    });

    return createdResponse({ res, data: budget });
  } catch (error) {
    console.error("Create budget error:", error);

    if (error.message === "Budget not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Start date must be before end date") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    if (error.message === "Budget already exists for this category in the specified date range") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 409 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during budget creation" } });
  }
}

/**
 * Handle getting a budget by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getBudgetById(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get budget
    const budget = await getBudgetByIdService(id, userId);

    return response200({ res, data: budget });
  } catch (error) {
    console.error("Get budget error:", error);

    if (error.message === "Budget not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching budget" } });
  }
}

/**
 * Handle getting all budgets with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getBudgets(req, res) {
  try {
    const filters = matchedData(req);
    const userId = req.user.userId;

    // Call service to get budgets
    const result = await getBudgetsService(userId, filters);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Get budgets error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching budgets" } });
  }
}

/**
 * Handle updating a budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateBudget(req, res) {
  try {
    const { id, ...updateData } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update budget
    const budget = await updateBudgetService(id, userId, updateData);

    return response200({ res, data: budget });
  } catch (error) {
    console.error("Update budget error:", error);

    if (error.message === "Budget not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category not found or inactive") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 404 });
    }

    if (error.message === "Start date must be before end date") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 400 });
    }

    if (error.message === "Budget already exists for this category in the specified date range") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 409 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during budget update" } });
  }
}

/**
 * Handle deleting a budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function deleteBudget(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to delete budget
    const result = await deleteBudgetService(id, userId);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Delete budget error:", error);

    if (error.message === "Budget not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during budget deletion" } });
  }
}

/**
 * Handle getting budget statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getBudgetStats(req, res) {
  try {
    const userId = req.user.userId;

    // Call service to get budget stats
    const stats = await getBudgetStatsService(userId);

    return response200({ res, data: stats });
  } catch (error) {
    console.error("Get budget stats error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching budget statistics" } });
  }
}

/**
 * Handle getting current active budgets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getCurrentBudgets(req, res) {
  try {
    const userId = req.user.userId;

    // Call service to get current budgets
    const budgets = await getCurrentBudgetsService(userId);

    return response200({ res, data: budgets });
  } catch (error) {
    console.error("Get current budgets error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching current budgets" } });
  }
}
