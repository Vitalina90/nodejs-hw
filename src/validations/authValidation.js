import { Segments, Joi } from 'celebrate';

//* Реєстрація користувача, схема валідації для тіла запиту
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// * Логування користувача, схема валідації для тіла запиту
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
