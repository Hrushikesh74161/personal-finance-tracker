import { matchedData } from "express-validator";
import { login as loginService, signup as signupService } from "../services/authService.js";
import { badRequest } from "../util/responses/clientErrorResponses.js";
import { serverErrorResponse } from "../util/responses/serverErrorResponses.js";
import { createdResponse, response200 } from "../util/responses/successResponses.js";

/**
 * Handle user signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password } = matchedData(req);

    // Call service to create user
    const user = await signupService({
      firstName,
      lastName,
      email,
      password,
    });

    return createdResponse({ res, data: user });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.message === "User with this email already exists") {
      return badRequest(res, { error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during signup" } });
  }
}

/**
 * Handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  try {
    const { email, password } = matchedData(req);

    // Call service to authenticate user
    const result = await loginService({ email, password });

    return response200({ res, data: result });
  } catch (error) {
    console.error("Login error:", error);

    if (error.message === "Invalid email or password") {
      return badRequest({ res, error: { message: error.message } });
    }

    return serverErrorResponse({ res, error: { message: "Internal server error during login" } });
  }
}
