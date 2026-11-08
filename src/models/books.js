import { getDb } from '../db/connect.js';

const bookProjection = {
    _id: 0,
    id: 1,
    authorId: 1,
    title: 1,
    publicationDate: 1
};

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).project(bookProjection).toArray();
    return books;
};

const getBookById = async (id) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id }, { projection: bookProjection });
    return book;
};

const createBook = async (book) => {
    const db = getDb();
    const collection = db.collection('books');
    await collection.insertOne(book);
};

const updateBook = async (id, book) => {
    const db = getDb();
    const collection = db.collection('books');
    const result = await collection.updateOne({ id }, { $set: book });
    return result;
};

const deleteBook = async (id) => {
    const db = getDb();
    const collection = db.collection('books');
    const result = await collection.deleteOne({ id });
    return result;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
