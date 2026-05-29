import { Router } from 'express';
import { celebrate } from 'celebrate';
import { registerUserSchema } from '../validations/authValidation.js';
import {
  logoutUser,
  registerUser,
  refreshUserSession,
} from '../controllers/authController.js';
import { loginUserSchema } from '../validations/authValidation.js';
import { loginUser } from '../controllers/authController.js';

//* Маршрут
const router = Router();

//* Реєстрація нового користувача
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

//* Логін зареєстрованого користувача
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

//* Оновлення сесії користувача
router.post('/auth/refresh', refreshUserSession);

//* Логаут, вихід користувача із системи (ендпоінт)
router.post('/auth/logout', logoutUser);

export default router;
