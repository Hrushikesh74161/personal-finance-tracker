/**
 * Sends a successful (HTTP 200 OK) JSON response.
 *
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object | Array | number | string | boolean | null} [params.data={}] - The data to send as part of the response body. Defaults to an empty object.
 * @returns {Response}
 */
export function response200({ res, data = {} }) {
  return res.status(200).json({ success: true, data });
}

/**
 * Sends a HTTP 201 created JSON response.
 * @param {object} params - The parameters for the response.
 * @param {Response} params.res - Response object.
 * @param {object | Array | number | string | boolean | null} [params.data={}] - The data to send as part of the response body. Defaults to an empty object.
 * @returns {Response}
 */
export function createdResponse({ res, data = {} }) {
  return res.status(201).json({ success: true, data });
}