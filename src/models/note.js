import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// оголошуємо схему-колекції (документ), його властивості (склад, тип і т.д)
const noteSchema = new Schema(
  {
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
      index: true,
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
    versionKey: false, //  — вимикає службове поле __v
  },
);

// Single field index — індекс по одному полю
noteSchema.index({ tag: 1 });

//створюємо модель
export const Note = model('Note', noteSchema);
