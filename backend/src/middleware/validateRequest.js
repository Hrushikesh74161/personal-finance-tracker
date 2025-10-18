import { validationResult } from "express-validator";
import { badRequest } from "../util/responses/clientErrorResponses.js";

/**
 * Middleware to validate request using express-validator
 * This middleware should be used after validation chains in routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Response|void} Returns error response if validation fails, otherwise calls next()
 */
export function validateRequest(req, res, next) {
  // Get validation errors from express-validator
  const errors = validationResult(req);

  // If there are validation errors, return bad request response
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(function (error) {
      return {
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      };
    });

    return badRequest({
      res,
      error: {
        message: "Validation failed",
        details: errorMessages
      }
    });
  }

  // If validation passes, continue to next middleware
  next();
}