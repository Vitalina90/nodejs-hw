import { HttpError } from 'http-errors';

//* Мiddleware, що перехоплює помилки
export const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message || err.name });
  }
  // if (isHttpError(err)){};
  res.status(500).json({
    message: isProd ? 'Server error' : err.message,
  });
};
