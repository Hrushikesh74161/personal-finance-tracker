/**
 * Sends an HTTP 500 Internal Server Error JSON response.
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object} [params.error={message: "Internal server error"}] - An error object to send as part of the response body.
 * @returns {Response} Response object, allowing for method chaining.
 */
export function serverErrorResponse({
  res,
  error = { message: "Internal server error" },
}) {
  return res.status(500).json({ success: false, error });
}