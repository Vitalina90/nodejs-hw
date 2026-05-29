import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

//* GET - повернення
export const getAllNotes = async (req, res) => {
  // отримуємо параметри запиту
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const limit = perPage;

  // створюємо базовий запит
  const myQuery = Note.find({
    // повертаємо лише нотатки, що належать поточному користувачу
    userId: req.user._id, // критерії пошуку за id
  }); // підготовка, налаштування Query

  // будуємо фільтр
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

  // пагінація
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

//* GET - пошук нотатки за її ідентифікатором
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  // повертаємо нотатку за її ідентифікатором, яка належить поточному користувачу
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id, // критерії пошуку за id
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

//* CREATE - створення
export const createNote = async (req, res) => {
  console.log(req.body);
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

//* DELETE - видалення
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  // видалення лише нотатки, яка належить поточному користувачу
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

//* PATCH - часткове оновлення ресурсу
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  console.log(req.body);

  // findOneAndUpdate(критерій_пошуку, оновлення, опції)
  const note = await Note.findOneAndUpdate(
    {
      // критерій пошуку по userId
      _id: noteId,
      userId: req.user._id,
    },
    req.body,
    {
      returnDocument: 'after',
    },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
