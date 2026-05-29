import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

//* Middleware аутентифікації
export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies; // перевіряємо accessToken

  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  // якщо вони є шукає у базі даних сесію за цим токеном
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // перевірка валідності accessToken (чи не прострочений)
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // пошук користувача, пов'язаного з цією сесією (якщо валідний)
  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, '');
  }

  req.user = user; // додаємо користувача на реквест
  next();
};
