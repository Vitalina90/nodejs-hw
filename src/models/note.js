import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

//* Оголошуємо схему-колекції (документ), його властивості (склад, тип і т.д)
const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // зв'язок між моделями `User` та `Note`
    },
    title: {
      type: String, // тип даних (String, Number, Boolean)
      required: true, // чи поле обов'язкове
      trim: true, // автоматично видаляє зайві пробіли на початку та в кінці рядка
    },
    content: {
      type: String,
      default: '', // значення за замовчуванням, якщо поле не передано
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS, // перелік допустимих значень (наприклад, для gender)
      default: 'Todo',
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
    versionKey: false, // вимикає службове поле __v
  },
);

//* Single field index — індекс по одному полю
noteSchema.index({
  tag: 1,
  userId: 1,
});

//* Створюємо модель нотаток
export const Note = model('Note', noteSchema);
