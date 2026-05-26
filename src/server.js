import express from 'express';
// Завантажує змінні середовища
import 'dotenv/config';
import cors from 'cors';
// Імпортуємо middleware
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/notesRoutes.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware -дозволяє робити запити з інших доменів
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    origin: '*', // який фронтенд взаємодіє з бекендом
  }),
);

// Middleware - дозволяє обробляти дані у форматі JSON, які надходять у body запиту
// Content-type:application/json, додає тіло запиту на req.body для контролерів
app.use(express.json());

// Middleware - інтегрує логування HTTP-запитів
app.use(logger);

// Middleware - оголошення маршрутів
app.use(router);

// обробка 404
app.use(notFoundHandler);

// обробка глобальних помилок від celebrate (валідація)
app.use(errors());

// глобальна обробка інших помилок
app.use(errorHandler);

// виклик ф-ції підключення бази даних
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
