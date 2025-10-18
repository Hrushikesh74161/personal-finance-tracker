import { matchedData } from "express-validator";
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getCategoryById as getCategoryByIdService,
  getCategories as getCategoriesService,
  updateCategory as updateCategoryService,
  getCategoryStats as getCategoryStatsService,
} from "../services/categoryService.js";
import { notFoundResponse } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle creating a new category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createCategory(req, res) {
  try {
    const categoryData = matchedData(req);
    const userId = req.user.userId;

    // Call service to create category
    const category = await createCategoryService({
      ...categoryData,
      userId,
    });

    return createdResponse({ res, data: category });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.message === "Category not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category with this name already exists") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 409 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during category creation" } });
  }
}

/**
 * Handle getting a category by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getCategoryById(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to get category
    const category = await getCategoryByIdService(id, userId);

    return response200({ res, data: category });
  } catch (error) {
    console.error("Get category error:", error);

    if (error.message === "Category not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching category" } });
  }
}

/**
 * Handle getting all categories with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getCategories(req, res) {
  try {
    const filters = matchedData(req);
    const userId = req.user.userId;

    // Call service to get categories
    const result = await getCategoriesService(userId, filters);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Get categories error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching categories" } });
  }
}

/**
 * Handle updating a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function updateCategory(req, res) {
  try {
    const { id, ...updateData } = matchedData(req);
    const userId = req.user.userId;

    // Call service to update category
    const category = await updateCategoryService(id, userId, updateData);

    return response200({ res, data: category });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.message === "Category not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    if (error.message === "Category with this name already exists") {
      return serverErrorResponse({ res, error: { message: error.message }, statusCode: 409 });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during category update" } });
  }
}

/**
 * Handle deleting a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function deleteCategory(req, res) {
  try {
    const { id } = matchedData(req);
    const userId = req.user.userId;

    // Call service to delete category
    const result = await deleteCategoryService(id, userId);

    return response200({ res, data: result });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.message === "Category not found") {
      return notFoundResponse(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during category deletion" } });
  }
}

/**
 * Handle getting category statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function getCategoryStats(req, res) {
  try {
    const userId = req.user.userId;

    // Call service to get category stats
    const stats = await getCategoryStatsService(userId);

    return response200({ res, data: stats });
  } catch (error) {
    console.error("Get category stats error:", error);

    return serverErrorResponse({ res, error: { message: "Internal server error while fetching category statistics" } });
  }
}
