import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

//* Реєстрація користувача
export const registerUser = async (req, res) => {
  // пошук користувача
  const existingUser = await User.findOne({ email: req.body.email });

  // перевірка чи існує користувач в системі
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // хешування пароля
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 означає кількість раундів "соління"

  // створення нового користувача
  const newUser = await User.create({
    email: req.body.email,
    password: hashedPassword,
  });

  // створення нової сесії при реєстрації
  const session = await createSession(newUser._id);

  // додавання cookie на відповідь
  setSessionCookies(res, session);

  // повертає відповідь зі статусом і об'єктом створеного користувача (без пароля завдяки методу схеми toJSON)
  res.status(201).json(newUser);
};

//* Логування користувача
export const loginUser = async (req, res) => {
  // перевіряє, чи користувач із таким email існує в базі даних
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // перевіряє чи вірний пароль
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // видалення старої сесії
  await Session.deleteOne({ userId: user._id });

  // створення сесії при логуванні
  const session = await createSession(user._id);

  // додавання cookie до відповіді
  setSessionCookies(res, session);

  // повертає відповідь зі статусом і об'єктом залогіненого користувача
  res.status(200).json(user);
};

//* Оновлення сесії користувача (ротація токенів)
export const refreshUserSession = async (req, res) => {
  // пошук сесії у базі даних
  const { sessionId, refreshToken } = req.cookies; // оновити токен

  if (!sessionId || !refreshToken) {
    // якщо будь-яких кук не існує повертаємо 401
    throw createHttpError(401, 'Session not found');
  }

  const session = await Session.findOne({
    // пошук сесії, якщо один із куків існує
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Invalid session');
  }

  // перевірка строка дії refreshToken
  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    throw createHttpError(401, 'Session token expired');
  }

  // видаляє стару сесію з бази (якшо є кукі, є сесія і refresh валідний)
  await session.deleteOne();

  // створює нову сесію і додає нові кукі до відповіді
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

//* Логаут користувача
export const logoutUser = async (req, res) => {
  // перевіряє cookies sessionId та видаляє відповідну сесію з бази даних
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  // очищає cookies (повідомлення на клієнта про видалення)
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  // повертає відповідь зі статусом (без тіла)
  res.status(204).send();
};
