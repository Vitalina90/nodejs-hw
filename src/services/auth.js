import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

//* Створення сесії в базі даних і повертає її (створює access та refresh токени)
export const createSession = async (id) => {
  return Session.create({
    userId: id,
    accessToken: crypto.randomUUID(), // унікальний рандомний рядок
    refreshToken: crypto.randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

//* Додавання cookie на відповідь
export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true, // заборона читання в браузері
    secure: true, // HTTPS
    sameSite: 'none', // дозволяє відправляти між різними url
    maxAge: FIFTEEN_MINUTES, // життя cookie, час дії
  }); // токін доступу до ресурсу

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};
