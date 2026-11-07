import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');
    const authors = await collection.find({}).toArray();

    return authors;
}

const getAuthorById = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id });

    return author;
}

const createAuthor = async (author) => {
    const db = getDb();
    const collection = db.collection('authors');
    const result = await collection.insertOne(author);

    return result;
}

const updateAuthor = async (id, author) => {
    const db = getDb();
    const collection = db.collection('authors');
    const authorFields = { ...author };
    delete authorFields.id;
    const result = await collection.updateOne({ id }, { $set: authorFields });

    return result;
}

const deleteAuthor = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');
    const result = await collection.deleteOne({ id });

    return result;
}

const authorHasBooks = async (id) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.countDocuments({ authorId: id });

    return book > 0;
}

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
};
