/**
 * Sends an HTTP 400 Bad Request JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "Bad Request"}] - An error object to send as part of the response body. Defaults to `{ message: "Bad Request" }`.
 * @param {string} [params.error.message] - A descriptive error message.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function badRequest({ res, error = { message: "Bad Request" } }) {
  return res.status(400).json({ status: false, error });
}

/**
 * Sends an HTTP 401 Unauthorized JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "You are not authorized"}] - An error object to send as part of the response body. Defaults to `{ message: "You are not authorized" }`.
 * @param {string} [params.error.message] - A descriptive error message.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function unAuthorizedRequest({
  res,
  error = { message: "You are not authorized" },
}) {
  return res.status(401).json({ status: false, error });
}

/**
 * Sends an HTTP 403 Forbidden JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "You are forbidden"}] - An error object to send as part of the response body. Defaults to `{ message: "You are forbidden" }`.
 * @param {string} [params.error.message] - A descriptive error message.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function forbiddenRequest({
  res,
  error = { message: "You are forbidden" },
}) {
  return res.status(403).json({ status: false, error });
}

/**
 * Sends an HTTP 404 Not Found JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "Resource not found"}] - An error object to send as part of the response body. Defaults to `{ message: "Resource not found" }`.
 * @param {string} [params.error.message] - A descriptive error message.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function notFoundResponse({
  res,
  error = { message: "Resource not found" },
}) {
  return res.status(404).json({ status: false, error });
}

/**
 * Sends an HTTP 429 Too Many Requests JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "Too many requests"}] - An error object to send as part of the response body. Defaults to `{ message: "Too many requests" }`.
 * @param {string} [params.error.message] - A descriptive error message.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function tooManyRequests({
  res,
  error = { message: "Too many requests" },
}) {
  return res.status(429).json({ status: false, error });
}
