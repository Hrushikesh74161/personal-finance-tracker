import jwt from "jsonwebtoken";
import { unAuthorizedRequest } from "../util/responses/clientErrorResponses.js";

/**
 * Middleware to verify JWT token in request headers
 * Checks for valid Authorization header with Bearer token format
 * Decodes token and attaches user data to request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void|Response>} Calls next() if token valid, returns unauthorized response if invalid
 */
export async function verifyToken(req, res, next) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    //
    const { authorization } = req.headers;
    if (!authorization) return unAuthorizedRequest({ res, error: { message: "Token not found" } });

    const token = authorization?.split(" ");
    if (token.length !== 2) return unAuthorizedRequest({ res, error: { message: "Invalid token format" } });
    jwt.verify(token[1], secretKey, async (err, decoded) => {
      if (err) {
        console.log({ err });
        return unAuthorizedRequest({ res, error: { message: "Error while parsing token" } });
      } else {
        if (!decoded) {
          return unAuthorizedRequest({ res, error: { message: "Cannot decode token" } });
        }
        req.user = decoded;

        next();
      }
    });
  } catch (err) {
    console.log({ err });
    return unAuthorizedRequest({ res, error: { message: "Error while verifying token" } });
  }
};

