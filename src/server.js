import express from 'express';
// Завантажує змінні середовища
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
// Імпортуємо middleware
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const PORT = process.env.PORT || 3000;

//* Middleware -дозволяє робити запити з інших доменів
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    origin: '*', // який фронтенд взаємодіє з бекендом
  }),
);

app.use(helmet());

//* Middleware - дозволяє обробляти дані у форматі JSON, які надходять у body запиту
app.use(express.json());

//* Middleware - додає req.cookies в контролері
app.use(cookieParser());

//* Middleware - інтегрує логування HTTP-запитів
app.use(logger);

//* Middleware - оголошення маршрутів
app.use(notesRoutes);
app.use(authRoutes);

//* Обробка 404
app.use(notFoundHandler);

//* Обробка глобальних помилок від celebrate (валідація)
app.use(errors());

//* Глобальна обробка інших помилок
app.use(errorHandler);

//* Виклик ф-ції підключення бази даних
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
