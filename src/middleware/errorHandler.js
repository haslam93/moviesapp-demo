import { config } from '../config/index.js';
import { HttpError } from '../utils/httpError.js';

// Basic structured error handler so frontend gets consistent payloads.
export const errorHandler = (err, req, res, next) => {
  const status = err instanceof HttpError ? err.status : 500;
  const isDevelopment = config.env !== 'production';
  const payload = {
    message: err.message ?? 'Unexpected error occurred'
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (isDevelopment) {
    payload.stack = err.stack;
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[API ERROR]', err);
  }

  res.status(status).json(payload);
  next();
};

export default errorHandler;
