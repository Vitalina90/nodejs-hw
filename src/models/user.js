import { Schema, model } from 'mongoose';

//* Створюємо схему користувача
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//* Перед збереженням додати/змінити властивості
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

//* Перевизначити toJSON() у моделі, стандартний код
userSchema.methods.toJSON = function () {
  const obj = this.toObject(); // створення точної копії
  delete obj.password; // видаляється властивість password
  return obj; // повертається копія на клієнта
};

//* Створюємо модель користувача
export const User = model('User', userSchema);
