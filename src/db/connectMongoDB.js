import mongoose from 'mongoose';
import { Note } from '../models/note.js';

//* Підключення до бази даних
// ф-цію викликаємо у server.js після реєстрації всіх контролерів
export async function connectMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    // гарантуємо, що індекси в БД відповідають схемі
    await Note.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // завершує процес
    process.exit(1);
  }
}
