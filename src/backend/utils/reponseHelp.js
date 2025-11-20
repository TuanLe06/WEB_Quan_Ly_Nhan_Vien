/**
 * Helper functions cho API response
 */

/**
 * Success response
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message: message
  };

  if (data !== null) {
    if (Array.isArray(data)) {
      response.count = data.length;
      response.data = data;
    } else {
      response.data = data;
    }
  }

  return res.status(statusCode).json(response);
}

/**
 * Error response
 */
function error(res, message = 'Error', statusCode = 500, details = null) {
  const response = {
    success: false,
    message: message
  };

  if (details && process.env.NODE_ENV !== 'production') {
    response.error = details;
  }

  return res.status(statusCode).json(response);
}

/**
 * Validation error response
 */
function validationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors: errors
  });
}

/**
 * Not found response
 */
function notFound(res, resource = 'Resource') {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
}

/**
 * Unauthorized response
 */
function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({
    success: false,
    message: message
  });
}

/**
 * Forbidden response
 */
function forbidden(res, message = 'Forbidden') {
  return res.status(403).json({
    success: false,
    message: message
  });
}

/**
 * Bad request response
 */
function badRequest(res, message = 'Bad request') {
  return res.status(400).json({
    success: false,
    message: message
  });
}

/**
 * Created response
 */
function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

/**
 * Deleted response
 */
function deleted(res, message = 'Deleted successfully') {
  return success(res, null, message, 200);
}

/**
 * Updated response
 */
function updated(res, data = null, message = 'Updated successfully') {
  return success(res, data, message, 200);
}

/**
 * Pagination response
 */
function paginated(res, data, page, limit, total, message = 'Success') {
  return res.status(200).json({
    success: true,
    message: message,
    data: data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

/**
 * No content response
 */
function noContent(res) {
  return res.status(204).send();
}

module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  badRequest,
  created,
  deleted,
  updated,
  paginated,
  noContent
};