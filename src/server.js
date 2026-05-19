import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
// Завантажує змінні середовища
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware -дозволяє робити запити з інших доменів
app.use(cors());

// Middleware - дозволяє обробляти дані у форматі JSON, які надходять у body запиту
app.use(express.json());

// Middleware - інтегрує логування HTTP-запитів
app.use(pinoHttp());

// GET зареєструвати обробник маршрута (повертає всі маршрути)
// app.get(шлях, ф-ція-обробник/контролер)

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Повертає одну нотатку за її ідентифікатором
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// спеціальний тестовий маршрут для імітації виникнення помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Мiddleware для обробки всіх запитів, що не відповідають жодному наявному маршруту
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  // Мiddleware що перехоплює помилки
  res.status(500).json({
    message: isProd ? 'Server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
