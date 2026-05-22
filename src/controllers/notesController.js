import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// контролери

// GET - отримує всі
export const getAllNotes = async (req, res) => {
  const notes = await Note.find(); // метод, що читає всю колекцію
  res.status(200).json(notes);
};

// повертає одну нотатку за її ідентифікатором
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
    // return res.status(404).json({ message: 'Student not found' });
    // throw new Error('Student not found');
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

  res.status(200).json({ message: 'deleted' });
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
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(note);
};
