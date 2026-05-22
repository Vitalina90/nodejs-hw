import { Schema, model } from 'mongoose';

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
      required: true,
      enum: [
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      ], // перелік допустимих значень (наприклад, для gender)
      default: 'Todo',
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
    // createdAt - дата створення об'єкта/документа
    // updatedAt - дата останнього редагування
    // versionKey: false — вимикає службове поле __v
  },
);

//створюємо модель
export const Note = model('Note', noteSchema);
