export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    if (details) {
      this.details = details;
    }
  }
}

export const notFound = (message = 'Resource not found') => new HttpError(404, message);
export const badRequest = (message = 'Bad request', details) => new HttpError(400, message, details);
export const serverError = (message = 'Internal server error', details) => new HttpError(500, message, details);

export default HttpError;
