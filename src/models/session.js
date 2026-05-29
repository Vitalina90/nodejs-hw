import { Schema, model } from 'mongoose';

//* Схема сесії ідентифікаторa користувача
const sessionSchema = new Schema(
  {
    userId: {
      // Id користувача
      type: Schema.Types.ObjectId,
      required: true,
    },
    accessToken: {
      // ключ доступу
      type: String,
      required: true,
    },
    refreshToken: {
      // ключ оновлення
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      // час валідності/дії токенів
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//* Створюємо модель сесії
export const Session = model('Session', sessionSchema);
