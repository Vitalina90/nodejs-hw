import { Segments, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().trim().allow(''),
  }),
};

// об'єкт валідації тіла запиту
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().default(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

// Якщо все добре, ID валідний, повернути сам ID
// Якщо все погано, ID не валідний, повернути helpers.message("SUPER BAD ID!!!")
// isValidObjectId(value) > true/false

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  if (isValidObjectId(value)) {
    // утиліта з Mongoose, яка перевіряє, чи рядок відповідає формату MongoDB ObjectId
    return value;
  }
  return helpers.message('Invalid id format');
};

// Схема для перевірки параметра noteId/валідація
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(), // кастомний валідатор
  }),
};

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string(),
    tag: Joi.string().valid(...TAGS),
  }).min(1), // важливо: не дозволяємо порожнє тіло
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};
