import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// контролери

// GET - отримує всі
export const getAllNotes = async (req, res) => {
  // Отримуємо параметри запиту
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const limit = perPage;

  // Створюємо базовий запит
  const myQuery = Note.find(); // підготовка, налаштування Query

  // Будуємо фільтр
  if (tag) {
    myQuery.where({ tag });
  }

  if (search) {
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        // регулярні вирази для пошуку в середині рядка
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // Пагінація
  const [totalNotes, notes] = await Promise.all([
    myQuery.clone().countDocuments(), // totalNotes повертає загальну к-сть документів в колекції + clone
    myQuery.skip(skip).limit(limit), // notes метод, що читає всю колекцію, пошук по пагінaції, фільтр skip/limit
  ]);

  const totalPages = Math.ceil(totalNotes / limit); // загальна к-сть сторінок

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// повертає одну нотатку за її ідентифікатором
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// CREATE - створення
export const createNote = async (req, res) => {
  console.log(req.body);
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// DELETE - видалення
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// PATCH - часткове оновлення ресурсу
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  console.log(req.body);

  // findOneAndUpdate(критерій_пошуку, оновлення, опції)
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    returnDocument: 'after',
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
