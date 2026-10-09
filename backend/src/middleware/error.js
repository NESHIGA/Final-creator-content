class HttpError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [];
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.statusCode ? err.message : 'Something went wrong';
  let errors = err.errors || [];

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for '${err.path}'`;
    errors = [{ field: err.path, message: 'Invalid format' }];
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || { field: '' })[0];
    message = `A record with this ${field} already exists`;
    errors = [{ field, message: 'Already in use' }];
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  if (statusCode >= 500) console.error(`[${statusCode}]`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { notFound, errorHandler, HttpError, asyncHandler };
