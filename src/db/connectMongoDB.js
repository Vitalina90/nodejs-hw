import mongoose from 'mongoose';

// підключення до бази даних
// ф-цію викликаємо у server.js після реєстрації всіх контролерів
export async function connectMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error(error.message);
    // завершує процес
    process.exit(1);
  }
}
